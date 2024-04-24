import {Request}     from 'express'
import {LogLevel}    from './log-level.js'
import {LogMetadata} from './logger.js'



export interface Log
{
	id: string;
	timestamp: Date;
	level: LogLevel;
	message: string;
	metadata?: LogMetadata | undefined;
	request?: Request | undefined;
	response?: Response | undefined;
}
