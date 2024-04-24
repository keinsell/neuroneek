import {Controller} from "@nestjs/common"

// Auth0 is a good example of Authentication API https://auth0.com/docs/api/authentication

// Passwordless connections do not require the user to remember a password. Instead, another mechanism is used to prove
// identity, such as a one-time code sent through email or SMS, every time the user logs in.

/** Form of authentication that does not rely on a password as the first factor. */
@Controller("passwordless")
export class Passwordless {

	//@Post("start")
	//async defineAuthenticationChallenge(): Promise<> {
	//	return intializePasswordlessAuthentication
	//}
	//
	//
	//@Post("solve")
	//async solveAuthenticationChallenge(): Promise<string> {
	//	return "start"
	//}
}