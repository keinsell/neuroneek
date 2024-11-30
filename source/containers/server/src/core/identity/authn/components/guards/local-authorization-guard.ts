import {Injectable}                 from "@nestjs/common"
import {AuthGuard, IAuthGuard}      from "@nestjs/passport"
import {AuthenticationStrategyType} from "../authentication-strategy"


@Injectable()

export class LocalAuthorizationGuard extends AuthGuard(AuthenticationStrategyType.LOCAL) implements IAuthGuard {

}