import { Type }                 from '@nestjs/common'
import { ModuleMetadata }       from '@nestjs/common/interfaces'
import { PrismaOptionsFactory } from './prisma-options-factory.js'
import { PrismaServiceOptions } from './prisma-service-options.js'



export interface PrismaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>
  {
	 isGlobal? : boolean;
	 useExisting? : Type<PrismaOptionsFactory>;
	 useClass? : Type<PrismaOptionsFactory>;
	 useFactory? : (...args : any[]) => Promise<PrismaServiceOptions> | PrismaServiceOptions;
	 inject? : any[];
  }