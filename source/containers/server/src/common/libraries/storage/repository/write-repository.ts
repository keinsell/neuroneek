import {Logger, NotFoundException} from '@nestjs/common'
import {isNil}                     from '../../../../utilities/type-utils/index.js'

// WriteRepository can:
// - Fetch an entity by unique identifier
// - Create an entity
// - Update an entity
// - Delete an entity
// WriteRepository cannot:
// - Fetch multiple entities
// - Fetch an entity by any other criteria than its unique identifier
// - Fetch an entity by multiple criteria
// - Fetch an entity by a criteria other than its unique identifier
// - Aggregate entities
// - List entities
// - Count entities

function logMethod(target: any, key: string, descriptor: PropertyDescriptor) {
	const originalMethod = descriptor.value;

	return {
		value: function (...args: any[]) {
			console.log(`Calling ${key}(${args})`);
			originalMethod.apply(this, args);
		},
	};
}


/**
 * Represents a generic write repository.
 *
 * @template T - The type of the entity.
 */
export abstract class WriteRepository<T> {
	private _logger: Logger = new Logger(this.constructor.name)


	abstract create(entity: T): Promise<T>;


	abstract update(entity: T): Promise<T>;


	abstract delete(entity: T): Promise<void>;


	abstract exists(entity: T): Promise<boolean>;


	async save(entity: T): Promise<T> {
		this._logger.debug("Saving entity", entity)

		const doesExist = await this.exists(entity)

		if (doesExist) {
			const updated = await this.update(entity)
			this._logger.verbose("Entity updated", updated)
			return updated
		} else {
			const created = await this.create(entity)
			this._logger.verbose("Entity saved", created)
			return created
		}
	}


	abstract findById(id: string): Promise<T | null>;


	async getById(id: string): Promise<T> {
		const entity = await this.findById(id)

		if (isNil(entity)) {
			throw new NotFoundException(`Entity with id ${id} not found`)
		}

		return entity
	}
}