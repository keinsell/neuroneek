import {BadRequestException, Injectable, Logger} from '@nestjs/common'
import {PassportStrategy}                        from '@nestjs/passport'
import {setUser}                                 from '@sentry/node'
import {JwtPayload}                              from "jsonwebtoken"
import {ExtractJwt, Strategy}       from 'passport-jwt'
import {__authConfig}               from '../../../../configs/global/__config.js'
import {AccountService}             from '../../../../modules/account/services/account-service.js'
import {AuthenticationStrategyType} from '../../../../modules/authentication/contract/authentication-strategy/authentication-strategy-type.js'
import {AuthenticationStrategy}     from '../../../../modules/authentication/contract/authentication-strategy/authentication-strategy.js'



@Injectable()
export class JwtAuthorizationStrategy extends PassportStrategy(Strategy, AuthenticationStrategyType.JWT)
	implements AuthenticationStrategy {
	private logger: Logger = new Logger('authorization::strategy::jwt')


	constructor(private accountService: AccountService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey:    new TextEncoder().encode(__authConfig.JWT_SECRET),
		})
	}


	async validate(payload: JwtPayload): Promise<any> {
		this.logger.verbose(`Decoded jsonwebtoken from authorization header`)

		// Type guard against missing sub
		if (!payload.sub) {
			throw new BadRequestException('Provided JWT does not contain "sub" property which is required to proceed.')
		}

		// Fetch profile associated with token
		const account = await this.accountService.getById(payload.sub)

		setUser({
			id:       account.id,
			username: account.username,
			email:    account.email.address,
		})

		// TODO: Fetch session associated with token
		// TODO: Check if session is valid (not blacklisted and
		// existing) TODO: Return User to middleware

		return account
	}
}