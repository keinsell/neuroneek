import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common"
import {err, ok, Result}                                      from "neverthrow"
import {EventBus}                                             from "../../../../common/modules/messaging/event-bus.js"
import {PasswordHashing}                                      from "../../../../common/libraries/unihash/password-hashing.service.js"
import {Account}                                              from "../../entities/account.js"
import {AccountRepository}                                    from "../../repositories/account-repository.js"



/**
 * This class is responsible for validating credentials. This is exposed by shared-kernel and further used by
 * authentication to encapsulate the logic of validating credentials as authentication do not have access to domain itself.
 */
@Injectable()
export class CredentialValidator {
	constructor(private repository: AccountRepository, private hashingService: PasswordHashing, private eventBus: EventBus) {}


	/**
	 * Validates the credentials of a user.
	 *
	 * @param {string} username - The username of the user.
	 * @param {string} password - The password of the user.
	 * @returns {Promise<any>} - A promise that resolves with the validation result.
	 */
	public async validateCredentials(username: string, password: string): Promise<Result<Account, NotFoundException | UnauthorizedException>> {
		// Find the domain by any username field (email, username)
		const user = await this.repository.findByUsernameFields(username)

		if (!user) {
			return err(new NotFoundException("User not found"))
		}

		// Verify the password

		const passwordVerified = await user.password.compare(password, this.hashingService.which(user.password.hash.serialize()))

		if (!passwordVerified) {
			return err(new UnauthorizedException("Invalid credentials"))
		}

		user.authenticate()

		await this.eventBus.publishAll(user.getUncommittedEvents() as any)

		return ok(user)
	}
}