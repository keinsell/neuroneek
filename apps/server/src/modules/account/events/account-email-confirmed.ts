import { DomainEvent } from '../../../common/libraries/domain/domain-event.js'
import { Account }     from '../entities/account.js'



export class AccountEmailConfirmed
  extends DomainEvent<Account>
  {
  }