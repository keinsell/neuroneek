import {Module}              from "@nestjs/common"
import {UnihashModule}       from "../../../../common/libraries/unihash/unihash-module.js"
import {AccountModule}       from "../../account.module.js"
import {CredentialValidator} from "./credential-validator.js"



@Module({
	imports:     [AccountModule, UnihashModule],
	controllers: [],
	providers:   [
		CredentialValidator,
	],
	exports:     [CredentialValidator],
})
export class CredentialValidatorModule {}