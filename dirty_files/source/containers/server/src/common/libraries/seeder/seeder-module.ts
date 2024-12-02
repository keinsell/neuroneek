import {
  DynamicModule,
  ForwardReference,
  Module,
  Provider,
  Type,
}                        from '@nestjs/common'
import { Seeder }        from './interfaces/seeder-interface.js'
import { SeederBase }    from './seeder-base.js'
import { SeederService } from './services/seeder-service.js'



export interface SeederModuleOptions
  {
	 seeders : Provider<Seeder>[];
	 imports? : Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
	 providers? : Provider[];
  }


@Module( {} )
export class SeederModule
  {
	 static register(options : SeederModuleOptions) : DynamicModule
		{
		  return {
			 module    : SeederModule,
			 imports   : options.imports || [],
			 providers : [
				...(
				  options.providers || []
				),
				...options.seeders,
				{
				  provide    : SeederService,
				  useFactory : (...seeders : SeederBase<any>[]) : SeederService => {
					 return new SeederService( seeders )
				  },
				  inject     : options.seeders as Type<any>[],
				},
			 ],
		  }
		}
  }