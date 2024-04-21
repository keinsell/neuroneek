import { DomainEvent }  from '../../../common/libraries/domain/domain-event.js'
import type { Account } from '../entities/account.js'



export class AccountVerificationEmailSent
  extends DomainEvent<Account>
  {
  }