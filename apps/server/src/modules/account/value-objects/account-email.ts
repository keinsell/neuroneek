import {ApiProperty}      from '@nestjs/swagger'
import {ImmutableClass}   from '../../../common/libraries/dst/data-class/data-class.js'
import {EmailAddress}     from "../../../kernel/modules/mailer/value-object/email-address.js"
import {ApiAccountMockup} from '../../../utilities/fixtures/api-account-mockup.js'



export const ApiPropertyAccountEmail = ApiProperty({
	                                                   name       : 'email',
	                                                   description: 'The' + ' account\'s email address',
	                                                   example    : ApiAccountMockup.email,
	                                                   examples   : ApiAccountMockup._examples.emails,
	                                                   type       : String,
                                                   })


export class AccountEmail
	extends ImmutableClass
{
	address: EmailAddress
	isVerified: boolean
}
