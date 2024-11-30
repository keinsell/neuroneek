import { PrismaServiceOptions } from './prisma-service-options.js'



export interface PrismaOptionsFactory
  {
	 createPrismaOptions() : Promise<PrismaServiceOptions> | PrismaServiceOptions;
  }