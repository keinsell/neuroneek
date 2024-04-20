import {Body, Controller, Post, Query, UseGuards} from "@nestjs/common"
import {ApiOperation}                             from "@nestjs/swagger"
import {OpenapiTags}                              from "../../../common/modules/documentation/swagger/openapi-tags.js"
import {JwtAuthorizationGuard}                    from "../../authentication/guards/jwt-authorization-guard.js"
import {AccountRecovery}                          from "../services/account-recovery.js";
import {RecoverAccount}                           from "../dtos/recover-account.js";
import {AccountService}                           from "../services/account-service.js";



@Controller("/account/recovery")
export class AccountRecoveryController {

	constructor(
		private accountService : AccountService,
		private accountRecovery : AccountRecovery,
	)
	{}

	@UseGuards(JwtAuthorizationGuard) @ApiOperation({
		operationId: "forgot-password",
		summary    : "Request password reset",
		description: "Sends a password reset email",
		tags       : [OpenapiTags.ACCOUNT_RECOVERY],
	}) @Post('forgot-password')
	async recoverAccount(@Body() body : RecoverAccount) : Promise<string> {

		const account = await this.accountService.getById(body.username)

		await this.accountRecovery.startPasswordRecovery(account.id)

		return "ok"
	}


	@UseGuards(JwtAuthorizationGuard) @ApiOperation({
		operationId: "reset-password",
		summary    : "Reset password",
		description: "Resets the user's password",
		tags       : [OpenapiTags.ACCOUNT_RECOVERY],
	}) @Post('reset-password')
	async resetPassword(@Query("code") code : string) : Promise<string> {
		// TODO: Check if given parameter is correct password request in cache
		// TODO: Find a related account to secret
		// TODO: Change password of account
		// TODO: Publish event of password changed
		// TODO: Return
		return "reset-password"
	}
}