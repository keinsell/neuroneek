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

import {randomUUID}          from 'node:crypto'
import {EmailMessage}                 from "../../../kernel/modules/mailer/entity/email-message.js"
import {EmailContent, isEmailContent} from "../../../kernel/modules/mailer/value-object/email-content.js"
import {EmailRecipient}               from "../../../kernel/modules/mailer/value-object/email-recipient.js"
import type {AccountId}      from '../../../modules/account/shared-kernel/account-id.js'
import {
	EntityBase,
	type EntityFoundation,
}                            from '../../libraries/domain/entity/entity-base.js'
import {NotificationQueued}  from '../event/notification-queued.js'
import {NotificationChannel} from '../value-object/notification-channel.js'
import {NotificationStatus}  from '../value-object/notification-status.js'



type ChannelContentMap = {
	[NotificationChannel.EMAIL]: EmailContent
	[NotificationChannel.SMS]: unknown
	[NotificationChannel.PUSH]: unknown
	[NotificationChannel.WEBHOOK]: unknown
}

type ReceipentByChannelMap = {
	[NotificationChannel.EMAIL]: EmailRecipient,
	[NotificationChannel.SMS]: unknown
	[NotificationChannel.PUSH]: unknown
	[NotificationChannel.WEBHOOK]: unknown
}


export interface NotificationProperties<T extends NotificationChannel>
	extends EntityFoundation<string>
{
	type: NotificationChannel
	content: ChannelContentMap[T]
	recipient: ReceipentByChannelMap[T]
	status?: NotificationStatus
	sentAt?: Date
	sentBy: AccountId
	priority?: 'LOW' | 'MEDIUM' | 'HIGH'
}


export class Notification<T extends NotificationChannel>
	extends EntityBase
	implements NotificationProperties<T>
{
	content: ChannelContentMap[T]
	priority: 'LOW' | 'MEDIUM' | 'HIGH'
	recipient: ReceipentByChannelMap[T]
	sentAt: Date | undefined
	sentBy: AccountId
	status: NotificationStatus
	type: NotificationChannel


	constructor(payload: NotificationProperties<T>)
	{
		super({
			      id       : payload.id ?? randomUUID(),
			      updatedAt: payload.updatedAt,
			      createdAt: payload.createdAt,
			      version  : payload.version,
		      })
		this.type = payload.type

		// Validate Content Type

		if (this.type === NotificationChannel.EMAIL)
		{
			const isEmail = isEmailContent(payload.content)

			if (!isEmail)
			{
				throw new Error('Invalid Email Message')
			}

			this.content = payload.content as EmailMessage
		}

		this.status    = payload.status ?? NotificationStatus.PENDING
		this.sentAt    = payload.sentAt
		this.sentBy    = payload.sentBy
		this.priority  = payload.priority ?? 'MEDIUM'
		this.recipient = payload.recipient

		this.postConstructorLoggerHook()
	}


	queue()
	{
		this.when(NotificationStatus.FAILED, this.status)
		this.logger.debug('Queueing notification...')
		this.status                     = NotificationStatus.PENDING
		const event: NotificationQueued = new NotificationQueued(this)
		this.appendEvent(event)
		this.logger.debug('Queued notification.')
		return this
	}


	send()
	{
		this.logger.debug('Sending notification...')
		this.status = NotificationStatus.SENT
		// TODO: Append Event
		this.logger.log('Sent notification.')
		return this
	}


	cancel()
	{
	}


	retry()
	{
	}


	process()
	{
		this.logger.debug('Processing notification...')
		this.logger.debug('Actions on notification will be locked until it is processed.')
		return this
	}


	fail()
	{
	}
}
