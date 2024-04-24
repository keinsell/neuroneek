import {Injectable, Logger}     from '@nestjs/common'
import {PassportStrategy}       from '@nestjs/passport'
import {Strategy}               from 'passport-local'
import {AuthenticationStrategy} from "../../../../core/identity/authn/components/authentication-strategy/index.js"



@Injectable()
export class LocalAuthorizationStrategy extends PassportStrategy(Strategy) implements AuthenticationStrategy {
	private logger: Logger = new Logger('authorization::strategy::local')


	constructor() {
		super()
	}


	async validate(username: string, password: string): Promise<any> {
		//const span = new OpentelemetryTracer().startSpan('authentication.local', {
		//	attributes: {
		//		'op':   'function',
		//		'name': 'LocalAuthorizationStrategy.validate',
		//	},
		//})
		//
		//span.setAttribute('user_username', username)
		//span.setAttribute('user.username', username)
		//
		//this.logger.verbose(`User "${username}" is trying to authenticate with "${censorString(password)}"`)
		//
		//const user = await this.credentialValidation.validateCredentials(username.toLowerCase(), password)
		//
		//if (user.isErr()) {
		//	span.end()
		//	this.logger.debug(`Authorization failed: ${JSON.stringify(user.error)}`)
		//	throw user.error
		//} else {
		//	this.logger.debug(`Authenticated user ${user.value.id}`)
		//
		//	span.addEvent('authenticated')
		//	span.setAttribute('user_id', user.value.id)
		//	span.setAttribute('user.id', user.value.id)
		//
		//	span.end()
		//
		//	setUser({
		//		id:       user.value.id,
		//		username: user.value.username,
		//		email:    user.value.email.address,
		//	})
		//
		//	return user.value
		//}
	}
}