import {Injectable}                 from "@nestjs/common"
import {AuthGuard, IAuthGuard}      from "@nestjs/passport"
import {AuthenticationStrategyType} from "../contract/authentication-strategy/authentication-strategy-type.js"



@Injectable()
export class JwtAuthorizationGuard
	extends AuthGuard(AuthenticationStrategyType.JWT)
	implements IAuthGuard {}