import { FactoryValue } from '../decorators/factory-decorator.js'



export interface Factory
  {
	 generate(
		count : number,
		values? : Record<string, any>,
	 ) : Record<string, FactoryValue>[];
  }