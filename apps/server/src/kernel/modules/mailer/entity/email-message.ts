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



import {EmailAddress}    from '../value-object/email-address.js'
import {EmailAttachment} from '../value-object/email-attachment.js'
import {EmailContent}    from '../value-object/email-content.js'
import {EmailRecipient}  from '../value-object/email-recipient.js'
import {Html}            from '../value-object/html.js'
import {PlainText}       from '../value-object/plain-text.js'



export interface IEmailMessage
	extends EmailContent
{
	recipient: EmailRecipient
	sender?: {
		from: EmailAddress
		replyTo?: string
	}
}


export class EmailMessage
	implements IEmailMessage
{
	attachments?: EmailAttachment[]
	body?: Html | PlainText
	subject?: string
	recipient: EmailRecipient
	sender?: {
		from: EmailAddress
		replyTo?: string
	}

	constructor(message: IEmailMessage)
	{
		this.body        = message.body
		this.recipient   = message.recipient
		this.sender      = message.sender
		this.subject     = message.subject
		this.attachments = message.attachments
	}
}
