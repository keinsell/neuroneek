import { Repository } from '../../../common/libraries/storage/index.js'
import { Account }    from '../entities/account.js'



export abstract class AccountRepository
  extends Repository<Account>
  {

	 abstract findByUsername(username : string) : Promise<Account | null>


	 abstract findByEmail(email : string) : Promise<Account | null>


	 abstract findByUsernameFields(username : string) : Promise<Account | null>
  }