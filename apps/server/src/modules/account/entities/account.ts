import {BadRequestException}               from '@nestjs/common'
import {
	AggregateRootProperties,
	BaseAggregateRoot,
}                                          from '../../../common/libraries/domain/aggregate.js'
import {AccountEmailConfirmed}             from '../events/account-email-confirmed.js'
import {AccountEvent}                      from '../events/account-event.js'
import {AccountVerificationEmailRequested} from '../events/account-verification-email-requested.js'
import type {AccountId}                    from '../shared-kernel/account-id.js'
import {AccountEmail}                      from '../value-objects/account-email.js'
import {AccountGroup}                      from '../value-objects/account-group.js'
import {AccountStatus}                     from '../value-objects/account-status.js'
import {Password}                          from '../value-objects/password.js'
import {Username}                          from '../value-objects/username.js'



export interface IdentityProperties
	extends AggregateRootProperties
	{
		email: AccountEmail
		password: Password
		username: Username
		status: AccountStatus
		groups: AccountGroup[]
	}


export class Account
	extends BaseAggregateRoot<AccountId>
	implements IdentityProperties
	{
		public email: AccountEmail
		public groups: AccountGroup[]
		public password: Password
		public status: AccountStatus
		public username: Username
		public readonly usernameFields: any = [
			'username',
			'email',
		]


		private constructor(payload: IdentityProperties)
			{
				super({
					      id       : payload.id,
					      createdAt: new Date(),
					      updatedAt: new Date(),
				      })
				this.email    = payload.email
				this.username = payload.username
				this.password = payload.password
			}


		static RegisterAccount(payload: Omit<IdentityProperties, 'status'>)
			{
				let account = new Account({
					                          ...payload,
					                          status  : AccountStatus.INACTIVE,
					                          password: payload.password,
				                          })

				account = account.register()

				return account
			}


		static build(payload: IdentityProperties)
			{
				return new Account(payload)
			}


		public changeUsername(username: Username)
			{
				this.username = username
				// TODO: Add UsernameChangedEvent
				return this
			}


		public requestPasswordReset()
			{
			}


		public requestVerificationEmail()
			{
				const event = new AccountVerificationEmailRequested(this)
				this.appendEvent(event)
				return this
			}


		public resetPassword()
			{
			}


		public changeEmail(email: AccountEmail)
			{
				this.email = email
				return this
			}


		public changePassword()
			{
			}


		public deleteAccount()
			{
			}


		public verifyEmail()
			{
				if (this.email.isVerified)
					{
						throw new BadRequestException('Email is already verified.')
					}

				const verifiedEmail = AccountEmail.create({
					                                          address   : this.email.address,
					                                          isVerified: true,
				                                          })

				this.email = verifiedEmail

				const event = new AccountEmailConfirmed(this)

				this.appendEvent(event)

				return this
			}


		public register(): this
			{
				this.logger.debug('Registering account...')
				this.status = AccountStatus.ACTIVE
				this.appendEvent(new AccountEvent.Registred(this))
				this.logger.log('Account Registered')
				return this
			}


		public authenticate(): Account
			{
				return this
			}
	}