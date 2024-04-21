import {Body, Controller, Post}               from "@nestjs/common"
import {InitializePasswordlessAuthentication} from "../commands/initialize-passwordless-authentication.js";

// Auth0 is a good example of Authentication API https://auth0.com/docs/api/authentication

// Passwordless connections do not require the user to remember a password. Instead, another mechanism is used to prove
// identity, such as a one-time code sent through email or SMS, every time the user logs in.

/** Form of authentication that does not rely on a password as the first factor. */
@Controller("passwordless")
export class PasswordlessController {

	@Post("start")
	async defineAuthenticationChallenge(@Body() intializePasswordlessAuthentication : InitializePasswordlessAuthentication) : Promise<InitializePasswordlessAuthentication> {
		return intializePasswordlessAuthentication
	}

	@Post("solve")
	async solveAuthenticationChallenge() : Promise<string> {
		return "start"
	}
}