import {Controller} from '@nestjs/common'



@Controller('authenticate')
export class Authenticate {
	//private logger: Logger = new Logger('authentication::controller')
	//
	//
	//constructor(private authenticationService: LocalAuthenticationService) {
	//}
	//
	//
	//// TODO: This request is using doubled comparison of password which
	//// extends the time of the request.
	//@ApiBasicAuth() @UseGuards(LocalAuthorizationGuard) @Post() @ApiOperation({
	//	operationId: 'authenticate',
	//	summary:     'Basic Authentication',
	//	description: 'Logs the user in with usage of a username and password.',
	//	tags:        ['authentication'],
	//}) @ApiCreatedResponse({
	//	description: 'The user has been successfully authenticated and session was created.',
	//	type:        AuthenticationResponse,
	//}) @ApiAuthenticateNotFoundResponse @ApiBody({type: AuthenticateCommand})
	//async authenticate(@Req() request: Request, @Body() body: AuthenticateCommand): Promise<AuthenticationResponse> {
	//	const user: Account = request.user as unknown as Account
	//
	//	this.logger.verbose(`Request performed using local_${user.id} for user ${user.username}`)
	//
	//	const authenticatedOrException = await this.authenticationService.authenticate(user.username, body.password)
	//
	//	if (authenticatedOrException.isErr()) {
	//		throw authenticatedOrException.error
	//	}
	//
	//	const authenticationResult = authenticatedOrException.value
	//
	//	return {
	//		id:           authenticationResult.accountId,
	//		accessToken:  authenticationResult.accessToken,
	//		refreshToken: authenticationResult.refreshToken,
	//		mfa:          false,
	//	}
	//}
	//
	//
	//@UseGuards(JwtAuthorizationGuard) @Get() @ApiBearerAuth() @ApiOperation({
	//	operationId: 'whoami',
	//	summary:     'Who am I?',
	//	description: 'Returns the current user',
	//	tags:        ['authentication'],
	//}) @ApiOkResponse({
	//	type:        AccountViewModel,
	//	description: 'Account was found in system, and returned.',
	//})
	//async whoami(@Req() request: Request): Promise<AccountViewModel> {
	//	const user: Account = request.user as unknown as Account
	//
	//	return {
	//		id:            user.id,
	//		username:      user.username,
	//		email:         user.email.address,
	//		emailVerified: user.email.isVerified,
	//	}
	//}
}