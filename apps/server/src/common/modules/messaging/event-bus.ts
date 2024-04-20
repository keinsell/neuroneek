import {Injectable, Logger, type OnApplicationBootstrap, type OnApplicationShutdown, Optional} from '@nestjs/common'
import {EventEmitter2}                                                                         from '@nestjs/event-emitter'
import {Event}                                                                                 from '../../libraries/message/event.js'
import {Message}                                                                               from '../../libraries/message/message.js'
import type {TransactionalOutbox}                                                              from './transactional-outbox/transactional-outbox.js'



@Injectable()
export class EventBus implements OnApplicationShutdown, OnApplicationBootstrap {
	private logger: Logger = new Logger('event_bus')

	private eventNames: string[]


	constructor(private eventEmitter: EventEmitter2, @Optional() private transactionalOutbox: TransactionalOutbox) {
	}


	publish(event: Event) {
		if (this.transactionalOutbox) {
			this.transactionalOutbox.inbound(event)
		}

		this.logger.debug(`Publishing event for ${event.namespace}...`, event)

		const hasListeners = this.eventEmitter.hasListeners(event.namespace)

		if (!hasListeners) {
			this.logger.warn(`No listeners registered for ${event.namespace}. Event will be lost.`)
		}

		this.eventEmitter.emitAsync(event.namespace, event)
		.then(() => {
			this.logger.log(`Published event at ${event.namespace}`, event)

			if (this.transactionalOutbox) {
				this.transactionalOutbox.outbound(event)
			}
		})

	}


	async publishAll(events: Event[]) {
		for (const event of events) {
			await this.publish(event)
		}
	}


	public onApplicationShutdown(signal?: string): any {
		this.logger.log('Received shutdown signal, unregistering all' + ' listeners...')
	}


	public onApplicationBootstrap(): any {
		this.eventEmitter.onAny((event: string | string[]): void => {
			this.logger.verbose(`Routing ${event}...`)
		})

		const events = this.eventEmitter.eventNames()

		for (const eventName of events) {
			this.logger.log(`Registered "${eventName.toString()}" namespace with ${this.eventEmitter.listenerCount(eventName.toString())} listeners.`)
		}
	}

}


export abstract class EventBusBase {
	private messageBus: MessageBusBase


	constructor(messageBus: MessageBusBase) {
		this.messageBus = messageBus
	}


	public async publish(event: Event): Promise<void> {
		await this.messageBus.publish(event)
	}


	publishAll(events: any[]): Promise<void> {
		return this.messageBus.publishAll(events)
	}
}


// TODO: Can have outbox pattern here
export abstract class MessageBusBase {
	constructor() {
	}


	abstract publish(message: Message): Promise<void>


	async publishAll(messages: Message[]) {
		for (const message of messages) {
			await this.publish(message)
		}
	}
}