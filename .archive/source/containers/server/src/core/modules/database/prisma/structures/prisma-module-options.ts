import { PrismaServiceOptions } from './prisma-service-options.js'



export interface PrismaModuleOptions
  {
	 /**
	  * If "true", registers `PrismaModule` as a global module.
	  * See: https://docs.nestjs.com/modules#global-modules
	  */
	 isGlobal? : boolean;

	 prismaServiceOptions? : PrismaServiceOptions;
  }