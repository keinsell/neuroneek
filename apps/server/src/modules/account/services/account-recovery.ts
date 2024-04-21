import {Injectable} from "@nestjs/common";



@Injectable()
export class AccountRecovery {
	public async startPasswordRecovery(accountId : string) {
		// TODO: Generate Password Reset Request
		// TODO: Save PasswordResetRequest in cache for specific user
		// TODO: Send verification email for domain
		// TODO: Perform such actions only if domain is verified.
	}

	public async solvePasswordRecovery(code : string) {}
}