import {
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
}                        from '@nestjs/common'
import { NestFactory }   from '@nestjs/core'
import { SeederBase }    from './seeder-base.js'
import {
  SeederModule,
  SeederModuleOptions,
}                        from './seeder-module.js'
import { SeederService } from './services/seeder-service.js'



export interface SeederOptions
  {
	 imports? : Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
	 providers? : Provider[];
  }


export interface SeederRunner
  {
	 run(seeders : Provider<SeederBase<unknown>>[]) : void;
  }


async function bootstrap(options : SeederModuleOptions)
  {
	 const app            = await NestFactory.createApplicationContext( SeederModule.register( options ) )
	 const seedersService = app.get( SeederService )
	 await seedersService.run()

	 await app.close()
  }


export const seeder = (options : SeederOptions) : SeederRunner => {
  return {
	 run(seeders : Provider<SeederBase>[]) : void
		{
		  bootstrap( {
							...options,
							seeders,
						 } )
		},
  }
}