/** Initialize passwordless authentication. Is a command which will start new passwordless session in our system
 *  allowing user to perform two-step auth. */
export interface InitializePasswordlessAuthentication {
	/** How to send the code/link to the user. Use email to send the code/link using email, or sms to use SMS. */
	connection: "email" | "sms" | "pgp"
	/** The user's email address. */
	email?: string
	/** The user's phone number. */
	phoneNumber?: string
	/** Use link to send a link or code to send a verification code. If null, a link will be sent. */
	send?: "code" | "link"
}