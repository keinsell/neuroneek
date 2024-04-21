import {AccountAuthenticated} from "./account-authenticated.js"
import {AccountRegistered}    from "./account-registered.js"



export const AccountEvent = {
	Registred:     AccountRegistered,
	Authenticated: AccountAuthenticated,
}