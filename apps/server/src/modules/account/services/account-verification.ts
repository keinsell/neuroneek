import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
}                                     from '@nestjs/common'
import {OnEvent}                      from '@nestjs/event-emitter'
import ms                             from 'ms'
import {
	ok,
	Result,
}                                     from 'neverthrow'
import {randomUUID}                   from 'node:crypto'
import {EventBus}                     from '../../../common/modules/messaging/event-bus.js'
import {CacheManager}                 from '../../../common/modules/storage/cache-manager/contract/cache-manager.js'
import {NotificationService}          from '../../../common/notification/contract/notification-service.js'
import {StaticFeatureFlags}           from '../../../configs/static-feature-flags.js'
import {Mailer}                       from "../../../kernel/modules/mailer/contract/mailer.js"
import {CreateEmailMessagePayload}    from "../../../kernel/modules/mailer/dto/create-email-message-payload.js"
import {AccountEmailConfirmed}        from '../events/account-email-confirmed.js'
import {AccountRegistered}            from '../events/account-registered.js'
import {AccountVerificationEmailSent} from '../events/account-verification-email-sent.js'
import {AccountConfirmedNotification} from '../notifcation/account-confirmed-notification.js'
import {AccountRepository}            from '../repositories/account-repository.js'



@Injectable()
export class AccountVerification
{
	private logger: Logger
	private accountRepository: AccountRepository
	private publisher: EventBus
	private cacheManager: CacheManager
	private mailer: Mailer
	private notificationService: NotificationService


	constructor(accountRepository: AccountRepository, eventBus: EventBus, cacheManager: CacheManager, mailer: Mailer, notificationService: NotificationService)
	{
		this.logger              = new Logger('account::verification::service')
		this.accountRepository   = accountRepository
		this.publisher           = eventBus
		this.cacheManager        = cacheManager
		this.mailer              = mailer
		this.notificationService = notificationService
	}


	public async sendVerificationEmail(accountId: string): Promise<void>
	{
		const account = await this.accountRepository.getById(accountId)

		// Create secret code for email
		let verificationSecret: string = this.createVerificationSecret()

		// Save verificationSecret
		await this.cacheManager.set(`verification_${verificationSecret}`, accountId, ms('15m'))

		// Send verification email
		// TODO: Email template may be moved somewhere else
		const verificationEmail: CreateEmailMessagePayload = {
			recipient: {
				to: account.email.address,
			},
			subject  : 'Account Confirmation',
			body     : 'Your verification code is: ' + verificationSecret,
		}

		await this.mailer.sendEmail(verificationEmail)

		// Emit verification email sent event
		const emailVerificationSentEvent = new AccountVerificationEmailSent(account)
		this.publisher.publish(emailVerificationSentEvent)
	}


	public async resendVerificationEmail(accountEmail: string): Promise<void>
	{
		const account = await this.accountRepository.findByEmail(accountEmail)

		if (!account)
		{
			throw new NotFoundException('Account with associated mail was not found.')
		}

		if (account.email.isVerified)
		{
			throw new BadRequestException('Account email is already verified.')
		}

		account.requestVerificationEmail()

		const events = account.getUncommittedEvents()
		await this.publisher.publishAll(events)

		await this.accountRepository.save(account)

		await this.sendVerificationEmail(account.id)
	}


	public async verifyEmail(code: string): Promise<Result<true, false>>
	{
		const accountId = await this.cacheManager.get<string>(`verification_${code}`)

		if (!accountId)
		{
			throw new UnauthorizedException('Provided verification code is not valid.')
		}

		const account = await this.accountRepository.getById(accountId)

		if (!account)
		{
			throw new NotFoundException('Account associated with provided code was not found.')
		}

		// Verify Account's Email
		account.verifyEmail()

		await this.accountRepository.save(account)

		// Delete used verification code
		await this.cacheManager.delete(accountId)

		// Emit Account Verified Event
		const events = account.getUncommittedEvents()
		await this.publisher.publishAll(events)

		return ok(true)
	}


	@OnEvent('account.registered', {async: true})
	private async onAccountRegistered(event: AccountRegistered): Promise<void>
	{
		this.logger.debug(`Handling ${event.id} with "onAccountRegistered"`)
		await this.sendVerificationEmail(event.body!.aggregateId)
		this.logger.log(`Handled ${event.id} with "onAccountRegistered"`)
	}


	@OnEvent('account.verification.completed')
	private async onEmailVerified(event: AccountEmailConfirmed): Promise<void>
	{
		this.logger.debug(`Handling ${event.id} with "onEmailVerified": ${JSON.stringify(event)}`)

		if (!event.body?.email)
		{
			throw new BadRequestException('Email is missing.')
		}

		// Create notification
		const notification = new AccountConfirmedNotification(event.body?.email)

		// Send notification
		await this.notificationService.sendNotification(notification)

		this.logger.debug(`Handled ${event.id} with "onEmailVerified"`)
	}


	private createVerificationSecret(): string
	{
		let verificationSecret: string

		if (StaticFeatureFlags.shouldUseTestingVerificationCode)
		{
			verificationSecret = 'verification_code'
		}
		else
		{
			verificationSecret = randomUUID()
		}

		return verificationSecret
	}
}
