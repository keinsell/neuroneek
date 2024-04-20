/*
 * MIT License
 *
 * Copyright (c) 2024 Jakub Olan <keinsell@protonmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { Logger }            from '@nestjs/common'
import type { EmailMessage } from '../entity/email-message.js'
import {
  type EmailAddress,
  isEmailAddress,
}                            from '../value-object/email-address.js'



export function isEmailMessage(value : unknown) : value is EmailMessage
  {
	 const logger = new Logger( 'email-message' )
	 logger.debug( `Validating if ${JSON.stringify( value )} is an EmailMessage` )

	 if ( !isObject( value ) )
		{
		  logger.debug( `Validated if ${JSON.stringify( value )} is an EmailMessage: IS_NOT` )
		  return false
		}

	 const message = value as EmailMessage

	 const result = ( hasValidRecipient( message.recipient ) && hasValidSender( message.sender ) )

	 logger.debug( `Validated if ${JSON.stringify( value )} is an EmailMessage: ${result === true ? 'IS' : 'IS_NOT'}` )

	 return result
  }

function isObject(value : unknown) : value is object
  {
	 return typeof value === 'object' && value !== null
  }

function hasValidRecipient(recipient : EmailMessage['recipient']) : boolean
  {
	 return ( recipient !== undefined && hasValidEmailAddress( recipient.to ) && hasValidEmailAddressArray(
		recipient.cc ) && hasValidEmailAddressArray( recipient.bcc ) )
  }

function hasValidSender(sender : EmailMessage['sender']) : boolean
  {
	 return sender === undefined || ( sender.from !== undefined && hasValidEmailAddress( sender.from ) )
  }

function hasValidEmailAddress(email : EmailAddress | undefined) : boolean
  {
	 return email !== undefined && isEmailAddress( email )
  }

function hasValidEmailAddressArray(emails : EmailAddress[] | undefined) : boolean
  {
	 return emails === undefined || ( Array.isArray( emails ) && emails.every( hasValidEmailAddress ) )
  }
