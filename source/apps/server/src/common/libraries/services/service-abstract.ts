import { EntityBase } from '../domain/entity/entity-base.js'
import { Repository } from '../storage/index.js'



export class ServiceAbstract<T extends EntityBase<unknown> | any>
  {
	 private serviceRepository : Repository<T>


	 constructor(serviceRepository : Repository<T>)
		{
		  this.serviceRepository = serviceRepository
		}


	 public async getById(id : string) : Promise<T>
		{
		  return this.serviceRepository.getById( id )
		}


	 protected async save(entity : T) : Promise<T>
		{
		  return this.serviceRepository.save( entity )
		}
  }