import { Logger }          from '@nestjs/common'
import { PrismaQueryInfo } from './prisma-query-info.js'



export interface LoggingMiddlewareOptions
  {
	 logger : Console | Logger;
	 logLevel : 'log' | 'debug' | 'warn' | 'error';
	 /**
	  * Create a custom log message.
	  */
	 logMessage? : (query : PrismaQueryInfo) => string;
  }