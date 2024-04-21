import {BadRequestException, ConflictException, Inject, Injectable, Logger} from '@nestjs/common'
import {SpanStatusCode}                                                     from '@opentelemetry/api'
import {err, ok}                                                            from 'neverthrow'
import {BasePolicy}                                                         from '../../../common/libraries/domain/policy/base-policy.js'
import {Pwnproc}                                                            from '../../../common/libraries/pwnproc/pwnproc.js'
import {PasswordSecurityLevel}                                              from '../../../common/libraries/pwnproc/report/password-security-level.js'
import {OpentelemetryTracer}                                                from '../../../common/modules/observability/tracing/opentelemetry/provider/tracer/opentelemetry-tracer.js'
import {AccountRepository}                                                  from '../repositories/account-repository.js'



@Injectable()
export class AccountPolicy extends BasePolicy {
	@Inject(OpentelemetryTracer) tracer: OpentelemetryTracer
	private logger: Logger = new Logger('account::policy')


	constructor(private readonly accountRepository: AccountRepository, private readonly passwordSecurity: Pwnproc) {
		super()
	}


	public async canRegisterAccount(registerAccount: {
		email: string, username: string, password: string,
	}) {
		const span = this.tracer.startSpan('com.methylphenidate.account.policy.can_register_account')

		this.logger.debug(`Running CanRegisterAccount policy...`)

		const isUniqueUsername = await this.isUniqueUsername(registerAccount.username)
		const isUniqueEmail    = await this.isUniqueEmail(registerAccount.email)
		const isSecurePassword = await this.isSecurePassword(registerAccount.password)

		const maybePolicy = this.merge(isUniqueUsername, isUniqueEmail, isSecurePassword)

		if (maybePolicy.isErr()) {
			span.setStatus({code: SpanStatusCode.ERROR})
			span.recordException(maybePolicy.error)
			span.end()
			this.logger.warn(`CanRegisterAccount policy failed.`, maybePolicy.error)
			throw maybePolicy.error
		} else {
			span.setStatus({code: SpanStatusCode.OK})
			span.end()
			this.logger.verbose(`CanRegisterAccount policy passed.`)
			return maybePolicy.value
		}
	}


	private async isUniqueUsername(username: string) {
		const span = this.tracer.startSpan('com.methylphenidate.account.policy.is_unique_username')

		this.logger.debug(`Validating username uniqueness...`, {username})

		const identity = await this.accountRepository.findByUsername(username)

		if (identity) {
			span.setStatus({code: SpanStatusCode.ERROR})
			span.recordException(new ConflictException('Username is already in use in system, try logging in instead.'))
			span.end()
			this.logger.warn(`Username is already in use in system.`, {username})
			throw new ConflictException('Username is already in use in system, try logging in instead.')
		}

		this.logger.verbose(`Username is unique.`, {username})
		span.setStatus({code: SpanStatusCode.OK})
		span.end()
		return ok(true)
	}


	private async isUniqueEmail(email: string) {
		this.logger.debug(`Validating email uniqueness...`, {email})

		const identity = await this.accountRepository.findByEmail(email)

		if (identity) {
			this.logger.warn(`Email is already in use in system.`, {email})
			const error = new ConflictException('Email is already in use in system, try logging in instead.')
			throw error
		}

		this.logger.verbose(`Email is unique.`, {email})
		return ok(true)
	}


	private async isSecurePassword(password: string) {
		this.logger.debug(`Validating password security...`)

		const report = await this.passwordSecurity.generateReport(password)

		if (report.isScoreHigherThan(PasswordSecurityLevel.WEAK)) {
			this.logger.verbose(`Password is secure.`)
			return ok(true)
		} else {
			this.logger.warn(`Password is insecure enough.`)
			const error = new BadRequestException('Password is insecure enough.')
			return err(error)
		}
	}
}