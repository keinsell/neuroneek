import { Faker }                  from '@faker-js/faker'
import { FactoryMetadataStorage } from '../metadata/factory-metadata.js'



type BaseType =
  string
  | number
  | Date
  | Buffer
  | boolean
  | Record<string, any>;
export type FactoryValue =
  BaseType
  | Array<BaseType>;
export type FactoryValueGenerator = (
  faker? : Faker,
  ctx? : Record<string, any>,
) => FactoryValue;


export function Factory(arg : FactoryValueGenerator | FactoryValue)
  {
	 return (
		target : Record<string, any>,
		propertyKey : string | symbol,
	 ) : void => {
		FactoryMetadataStorage.addPropertyMetadata( {
																	 target      : target.constructor,
																	 propertyKey : propertyKey as string,
																	 arg,
																  } )
	 }
  }