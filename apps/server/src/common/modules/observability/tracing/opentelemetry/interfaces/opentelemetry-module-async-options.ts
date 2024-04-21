import { ModuleMetadata }                  from '@nestjs/common/interfaces'
import type { OpentelemetryConfiguration } from '../config/opentelemetry-configuration.js'



export interface OpentelemetryModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>
  {
	 useFactory? : (// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...args : any[]) => | Promise<Partial<OpentelemetryConfiguration>> | Partial<OpentelemetryConfiguration> | any;
	 // eslint-disable-next-line @typescript-eslint/no-explicit-any
	 inject? : any[];
  }