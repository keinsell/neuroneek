import { OptionPredicator } from 'typia/lib/programmers/helpers/OptionPredicator.js';
import {PhcString}          from '../../../../common/libraries/unihash/types/phc-string.js'
import {DbContextModel}     from '../../../../common/modules/database/db-context-model.js'
import { DataMapper }       from '../../../../common/persistance/data-mapper.js';
import {EmailAddress}       from "../../../../kernel/modules/mailer/value-object/email-address.js"
import {Account}            from '../../entities/account.js'
import {AccountEmail}       from '../../value-objects/account-email.js'
import {AccountStatus}      from '../../value-objects/account-status.js'
import {Password}           from '../../value-objects/password.js'
import {type Username}      from '../../value-objects/username.js'

export class AccountEntityMapper extends DataMapper<DbContextModel.Account.Entity, Account>{
  public map(data: DbContextModel.Account.Entity): Account
  {
    return Account.build({
                           email   : AccountEmail.create({address: data.email as EmailAddress, isVerified: data.email_verified}),
                           id      : data.id,
                           status  : AccountStatus.ACTIVE,
                           groups  : [],
                           password: Password.fromHash(PhcString.deserialize(data.password as any)),
                           username: data.username as Username,
                         })
  }

  public reverse(data: Account): DbContextModel.Account.Entity
  {
  throw new Error('Method not implemented.');
  }
}
