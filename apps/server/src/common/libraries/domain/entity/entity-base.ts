// TODO: https://linear.app/keinsell/issue/PROD-95/add-entity-base-class
import {Prisma}          from 'db'
import {randomUUID}      from 'node:crypto'
import {EventBus}        from '../../../modules/messaging/event-bus.js'
import {Repository}      from '../../storage/repository/repository.js'
import {AggregateLogger} from '../aggregate-logger.js'
import Enumerable = Prisma.Enumerable



export interface EntityIdentificationProperties<T>
{
	id?: T
}


export interface EntityAuditingProperties
{
	createdAt?: Date
	updatedAt?: Date
	version?: number
}


export interface EntityFoundation<ID_TYPE>
	extends EntityIdentificationProperties<ID_TYPE>,
	        EntityAuditingProperties
{
}


export class EntityBase<ID_TYPE = string>
{
	protected logger: AggregateLogger
	private readonly _createdAt: Date
	private _singularName?: string
	private _pluralName?: string
	private forwardRefName?: string
	/**
	 * Array that holds events data.
	 *
	 * @type {Array<any>}
	 */
	        //	 private _events : DomainEvent<T>[] = []
	private _events: any[] = []
	private readonly _id: ID_TYPE

	// TODO: Add ID Generation Strategy
	// TODO: Add Versioning Strategy
	// TODO: Add Timestamping Strategy
	// TODO: Add Auditing Strategy
	constructor(foundationParameters?: EntityFoundation<ID_TYPE>)
	{
		this._id         = foundationParameters?.id ?? randomUUID() as ID_TYPE
		this.logger      = new AggregateLogger(this)
		this._createdAt  = foundationParameters?.createdAt ?? new Date()
		this._updatedAt  = foundationParameters?.updatedAt ?? new Date()
		this._version    = foundationParameters?.version ?? 1
		this.appendEvent = this.appendEvent.bind(this)
	}


	private _updatedAt: Date

	get updatedAt(): Date
	{
		return this._updatedAt
	}


	get id(): ID_TYPE
	{
		return this._id
	}


	private _version: number = 1

	get version(): number
	{
		return this._version
	}


	get createdAt(): Date
	{
		return this._createdAt
	}


	/** Commits changes done on specific entity to the repository and publishes changes to other modules. */
	public async commit(repository: Repository<any>, bus?: EventBus): Promise<this>
	{
		this.bumpVersion()
		this.bumpUpdateDate()

		await repository.save(this)

		if (!bus)
		{
			console.warn('Event bus is not provided. Events will not be published.')
			return this
		}

		await bus.publishAll(this.getUncommittedEvents())

		return this
	}


	/**
	 * Retrieves the uncommitted events.
	 *
	 * @returns {Array} An array containing the uncommitted events.
	 */
	public getUncommittedEvents(): any[]
	{
		// Create a snapshot of events to prevent race conditions.
		const eventsSnapshot = this._events.slice()
		// Remove events from aggregate as we already have a copy of them.
		this._events         = []
		// Filter snapshot to only include pending events.
		return eventsSnapshot
	}


	/** Handle command in reflection-based method which will search an inter-class references for specific command and execute method basing on information from command. This method is used to handle commands in aggregates. */
	public handleCommand(command: any)
	{
		throw new Error('Method not implemented.' + command)
	}


	public __clearEvents(): this
	{
		this._events = []
		return this
	}


	protected bumpVersion(): this
	{
		this._version = this._version + 1
		this.logger   = new AggregateLogger(this)
		return this
	}


	protected appendEvent(event: any): this
	{
		this.bumpVersion()
		this.bumpUpdateDate()
		this._events.push(event)
		this.logger.verbose(`Event ${event.constructor.name} appended to aggregate.`)
		return this
	}


	protected postConstructorLoggerHook()
	{
		this.logger.verbose('Constructed aggregate')
	}


	protected when<T extends Enumerable<any>>(expected: T | T[], actual: T)
	{
		if (Array.isArray(expected))
		{
			if (!expected.includes(actual))
			{
				throw new Error(`Expected ${expected} but got ${actual}`)
			}
		}
		else
		{
			if (expected !== actual)
			{
				throw new Error(`Expected ${expected} but got ${actual}`)
			}
		}

	}


	protected whenNot<T extends Enumerable<any>>(expected: T | T[], actual: T)
	{
		if (Array.isArray(expected))
		{
			if (expected.includes(actual))
			{
				throw new Error(`Expected ${expected} but got ${actual}`)
			}
		}
		else
		{
			if (expected === actual)
			{
				throw new Error(`Expected ${expected} but got ${actual}`)
			}
		}
	}


	private bumpUpdateDate(): this
	{
		this._updatedAt = new Date()
		return this
	}
}
