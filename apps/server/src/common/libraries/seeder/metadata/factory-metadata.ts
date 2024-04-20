import { Type }             from '@nestjs/common'
import { PropertyMetadata } from '../interfaces/property-metadata.js'



export class FactoryMetadataStorageHost
  {
	 private properties = new Array<PropertyMetadata>()


	 addPropertyMetadata(metadata : PropertyMetadata) : void
		{
		  this.properties.push( metadata )
		}


	 getPropertyMetadatasByTarget(target : Type<unknown>) : PropertyMetadata[]
		{
		  return this.properties.filter( property => property.target === target )
		}
  }


const globalRef                                                  = global as any
export const FactoryMetadataStorage : FactoryMetadataStorageHost = globalRef.FactoryMetadataStorage || (
  globalRef.FactoryMetadataStorage = new FactoryMetadataStorageHost()
)