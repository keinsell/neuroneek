import {DbContextModel} from "../../../../common/modules/database/db-context-model.js"
import {Account}        from '../../entities/account.js';



export function DbContextModelAccountCreatePayloadMapper(account: Account): DbContextModel.Account.CreatePayload {
	return {
		id            : account.id,
		email         : account.email.address,
		email_verified: account.email.isVerified,
		password      : account.password.hash.serialize(),
		username      : account.username,
	}}
