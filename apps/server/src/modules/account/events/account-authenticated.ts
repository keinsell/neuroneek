import {Event}   from "../../../common/libraries/message/event.js"
import {Account} from "../entities/account.js"



export class AccountAuthenticated extends Event<Account> {
	constructor(account: Account) {
		super({
			namespace: "domain.authenticated",
			body:      account,
		})
	}
}