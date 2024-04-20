import {
	BadRequestException,
	Controller,
	Post,
	Query,
	UseGuards,
}                              from '@nestjs/common'
import {
	ApiOperation,
	ApiQuery,
}                              from '@nestjs/swagger'
import {ApiAccountMockup}      from '../../../utilities/fixtures/api-account-mockup.js'
import {JwtAuthorizationGuard} from '../../authentication/guards/jwt-authorization-guard.js'
import {AccountVerification}   from '../services/account-verification.js'



@Controller('/account/verification')
export class AccountVerificationController {

	constructor(private accountVerification: AccountVerification) {
	}


	@ApiOperation({
		operationId: 'verify-email',
		summary    : 'Verify Email',
		description: 'Verifies the user’s email',
		tags       : ['account'],
	}) @Post('verify-email') @ApiQuery({
		name   : 'verification_code',
		example: 'verification_code',
		type   : String,
	})
	async verifyEmail(@Query('verification_code') verificationCode: string): Promise<string> {
		const emailVerificationResult = await this.accountVerification.verifyEmail(verificationCode)

		if (emailVerificationResult.isErr())
			{
				throw new BadRequestException('Something gone wrong')
			}
		else
			{
				return 'ok'
			}
	}


	@UseGuards(JwtAuthorizationGuard) @ApiOperation({
		operationId: 'resend-verification-email',
		summary    : 'Re-send verification email',
		description: 'Resends the verification email',
		tags       : ['account'],
	}) @Post('resend-verification-email') @ApiQuery({
		name       : 'email',
		description: 'Email of created account to which verification email should be sent',
		example    : ApiAccountMockup.email,
	})
	async resendVerificationEmail(@Query('email') email: string): Promise<string> {
		email = email.toLowerCase()
		await this.accountVerification.resendVerificationEmail(email)
		return 'ok'
	}

}
