import {Module}                     from '@nestjs/common'
import {PassportModule}             from '@nestjs/passport'
import {DatabaseModule}             from '../../common/modules/database/database.module.js'
import {__authConfig}               from '../../configs/global/__config.js'
import {JwtModule}                  from "../../kernel/modules/identity/jwt.js"
import {AccountModule}              from '../account/account.module.js'
import {CredentialValidatorModule}  from '../account/shared-kernel/credential-validator/credential-validator-module.js'
import {AuthenticationController}   from './controllers/authentication-controller.js'
import {
	JwtAuthorizationStrategy,
	LocalAuthorizationStrategy,
}                                   from '../../kernel/modules/identity/authorization-strategy/index.js'
import {LocalAuthenticationService} from './services/local-authentication-service.js'



@Module({
	        imports    : [
		        CredentialValidatorModule,
		        AccountModule,
		        JwtModule,
		        PassportModule.register({
			                                session: true,
		                                }),
		        DatabaseModule,
	        ],
	        controllers: [AuthenticationController],
	        providers  : [
		        LocalAuthenticationService,
		        LocalAuthorizationStrategy,
		        JwtAuthorizationStrategy,
	        ],
	        exports    : [LocalAuthenticationService],
        })
export class AuthenticationModule
	{
	}