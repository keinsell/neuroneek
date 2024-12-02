import {Logger}           from '@nestjs/common'
import type {SetOptional} from 'type-fest'
import {TypeID}           from '../identification/index.js'
import {MessageType}      from './values/message-type.js'

// Messages are just plain data structures. They have attributes and that's it.
// They don't (and should not) have methods that do anything but declare
// attributes, and set and get attribute values. Messages do not validate
// themselves, transform or serialize themselves, send themselves, or save
// themselves. All of these capabilities are external capabilities to a
// message, and therefore are not behaviors of a message.

export class Message<BODY = unknown> {
	// Convert UserCreated/UserCreatedMessage to user.created
	static namespace: string = this.name
	.replace(/Message$/, '')
	.replace(/([A-Z])/g, (match) => `.${match.toLowerCase()}`)
	.replace(/^\./, '')
	.toLowerCase()

	id: TypeID<this['type']>
	/** `causationId` is an identifier used in event-driven architectures to track
	 * the causal relationship between events. It represents the ID of the
	 * event that caused the current event to occur. This can be useful for
	 * tracing and debugging issues in distributed systems, as it allows
	 * developers to see the sequence of events that led to a particular state
	 * or behavior.
	 *
	 * @see [RailsEventStore](https://railseventstore.org/docs/v2/correlation_causation/)
	 * @see [thenativeweb/commands-events/#1](https://github.com/thenativeweb/commands-events/issues/1#issuecomment-385862281)
	 */
	causationId?: TypeID<'message' | 'event' | 'command' | 'request' | 'reply' | 'query'> | undefined
	/** A correlation ID is a unique identifier used to correlate and track a
	 * specific transaction or event as it moves through a distributed system
	 * or
	 * across different components. It helps to trace the flow of a request and
	 * its associated responses across different services and systems.
	 * Correlation IDs can be generated and propagated automatically by
	 * software components or added manually by developers for debugging and
	 * troubleshooting purposes.
	 *
	 * @see [RailsEventStore](https://railseventstore.org/docs/v2/correlation_causation/)
	 * @see [thenativeweb/commands-events/#1](https://github.com/thenativeweb/commands-events/issues/1#issuecomment-385862281)
	 */
	public correlationId ?: string
	readonly headers?: Record<string, unknown> | undefined
	readonly metadata?: Record<string, unknown> | undefined
	readonly timestamp: Date   = new Date()
	readonly namespace: string = this.constructor.name
	.replace(/Message$/, '')
	.replace(/([A-Z])/g, (match) => `.${match.toLowerCase()}`)
	.replace(/^\./, '')
	.toLowerCase()
	readonly body: BODY
	readonly type: MessageType = MessageType.MESSAGE
	private readonly logger: Logger


	constructor(payload: SetOptional<Message<BODY>, 'id' | 'timestamp' | 'type' | 'namespace'>) {
		this.type          = payload.type ?? MessageType.MESSAGE
		this.namespace     = payload.namespace ? payload.namespace : this.constructor.name
		.replace(/Message$/, '')
		.replace(/([A-Z])/g, (match) => `.${match.toLowerCase()}`)
		.replace(/^\./, '')
		.toLowerCase()
		this.causationId   = payload.causationId
		this.correlationId = payload.correlationId
		this.timestamp     = payload.timestamp ?? new Date()
		this.body          = payload.body
		this.headers       = payload.headers
		this.id            = this.generateIdWithNamespace(this.type)

		this.logger = new Logger(`${this.id}`.replace('_', '::'))
		this.logger.verbose(`Created ${this.type} ${this.namespace}`, {message: this})
	}


	protected generateIdWithNamespace(namespace: MessageType): TypeID<this['type']> {
		// Generate random ID with namespace using random bytes
		return `${namespace as this['type']}_${Math.random().toString(36).slice(2)}` as TypeID<this['type']>
	}
}