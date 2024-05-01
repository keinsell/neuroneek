import {Injectable}                 from "@nestjs/common"
import {AuthGuard, IAuthGuard}      from "@nestjs/passport"
import { AuthenticationStrategyType } from "../authentication-strategy"


@Injectable()
export class JwtAuthorizationGuard extends AuthGuard(AuthenticationStrategyType.JWT) implements IAuthGuard {}