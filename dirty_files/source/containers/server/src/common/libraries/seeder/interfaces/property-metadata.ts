import {
  FactoryValue,
  FactoryValueGenerator,
} from '../decorators/factory-decorator.js'



export interface PropertyMetadata
  {
	 // eslint-disable-next-line @typescript-eslint/ban-types
	 target : Function;
	 propertyKey : string;
	 arg : FactoryValueGenerator | FactoryValue;
  }