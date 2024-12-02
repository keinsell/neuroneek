import {EntityBase} from './entity/entity-base.js'



export interface AggregateRootProperties
	{
		id?: any | undefined
		createdAt?: Date
		updatedAt?: Date
	}


// TODO: https://linear.app/keinsell/issue/PROD-93/add-aggregate-root-base-class
export class BaseAggregateRoot<ID_TYPE = string>
	extends EntityBase<ID_TYPE>
	implements AggregateRootProperties
	{
		constructor(aggregateBaseProperties: Partial<AggregateRootProperties>)
			{
				super({id: aggregateBaseProperties.id})
			}
	}