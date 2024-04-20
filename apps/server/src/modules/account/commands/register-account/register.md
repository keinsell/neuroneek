**Register Endpoint**

This endpoint is responsible for registering a new account in our system.

Following actions are performed when this path is hit:

1. A new user account is created in the database with the provided details.
2. A confirmation email is sent to the provided email address containing a token.

The user must confirm the email address by using the provided token. After that, they can visit /account/email/confirm
with the token as a query parameter to confirm their email.

### Effects after the operation:

1. Check your email for a confirmation message from our system which contains the unique token.
2. Our system stores your account information and awaits for your email confirmation.

### Possible Outcomes:

- An account gets successfully registered and awaits email confirmation.
- If the provided email already exists in our system, an error will be returned.
- The server will respond with errors in case of bad request data.

Please note that the registration process is incomplete until the email is confirmed by visiting the
/account/email/confirm an endpoint with the required token.