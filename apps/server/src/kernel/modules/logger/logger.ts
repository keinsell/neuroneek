import {Injectable}      from '@nestjs/common'
import {nanoid}          from 'nanoid'
import {Terminal}        from "nestjs-cls"
import {ConsoleAppender} from './appender/console-appender.js'
import {FileAppender}    from './appender/file-appender.js'
import {LogAppender}     from './log-appender.js'
import {LogLevel}        from './log-level.js'
import {Log}             from './log.js'



export type LogMetadataKey =
	'requestId'
	| 'correlationId'
	| 'error'
	| 'error-message'
	| 'context'
	| 'data'
	| string


export type LogMetadata = {
	request?: {
		id?: string
		correlationId?: string
		url?: string
		body?: unknown
		params?: unknown
		query?: unknown
		headers?: unknown
	}
	response?: {
		statusCode?: number
		body?: unknown
	}
	error?: {
		message?: string
		stack?: string
		code?: string
		cause?: string
	}
	context?: LogContext
	data?: unknown
}
export type LogContext =
	{
		context: string
		kind: 'SERVICE' | 'CONTROLLER' | 'REPOSITORY' | 'MIDDLEWARE' | 'PIPE' | 'GUARD' | 'INTERCEPTOR' | 'FILTER' | 'FUNCTION' | 'OTHER'
	}
	| string
	| undefined


export interface LoggerV2 {
	info(message: string, metadata?: LogMetadata): void
	info(objectOrMetadata: Terminal<unknown>, message?: string, metadata?: LogMetadata ): void
}

export class Logger
{
	private context: LogContext            = 'unknown'
	private logAppenderList: LogAppender[] = []
	private defaultMetadata: LogMetadata   = {}


	protected constructor(context?: LogContext, logAppenderList?: LogAppender[])
	{
		if (context)
		{
			this.context = context
		}

		this.defaultMetadata = {
			context: this.context,
		}

		if (logAppenderList)
		{
			this.logAppenderList = logAppenderList
		}
	}


	setContext(context: any)
	{

	}


	info(message: string, metadata?: LogMetadata): void
	{
		this.log({
			         id       : this.generateLogId(),
			         timestamp: new Date(),
			         level    : LogLevel.INFO,
			         message,
			         metadata : {...this.defaultMetadata, ...metadata},
		         })
	}


	warn(message: string, metadata?: LogMetadata): void
	{
		this.log({
			         id       : this.generateLogId(),
			         timestamp: new Date(),
			         level    : LogLevel.WARN,
			         message,
			         metadata : {...this.defaultMetadata, ...metadata},
		         })
	}


	error(message: string, metadata?: LogMetadata): void
	{
		this.log({
			         id       : this.generateLogId(),
			         timestamp: new Date(),
			         level    : LogLevel.ERROR,
			         message,
			         metadata : {...this.defaultMetadata, ...metadata},
		         })
	}


	fatal(message: string, metadata?: LogMetadata): void
	{
		this.log({
			         id       : this.generateLogId(),
			         timestamp: new Date(),
			         level    : LogLevel.FATAL,
			         message,
			         metadata : {...this.defaultMetadata, ...metadata},
		         })
	}


	trace(message: string, metadata?: LogMetadata): void
	{
		this.log({
			         id       : this.generateLogId(),
			         timestamp: new Date(),
			         level    : LogLevel.TRACE,
			         message,
			         metadata : {...this.defaultMetadata, ...metadata},
		         })
	}


	debug(message: string, metadata?: LogMetadata): void
	{
		this.log({
			         id       : this.generateLogId(),
			         timestamp: new Date(),
			         level    : LogLevel.DEBUG,
			         message,
			         metadata : {...this.defaultMetadata, ...metadata},
		         })
	}


	protected log(log: Log): void
	{
		for (const appender of this.logAppenderList)
		{
			appender.append(log)
		}
	}


	protected registerAppender(appender: LogAppender): void
	{
		this.logAppenderList.push(appender)
	}


	protected unregisterAppender(appender: LogAppender): void
	{
		this.logAppenderList = this.logAppenderList.filter(a => a !== appender)
	}


	private generateLogId(): string
	{
		const ID_LENGTH = 256
		return nanoid(ID_LENGTH)
	}
}


@Injectable()
export class CombinedLogger
	extends Logger
{
	constructor(name?: string)
	{
		super(name, [
			new ConsoleAppender(),
			new FileAppender({
				                 filePath: 'logs/app.log',
				                 level   : LogLevel.INFO,
			                 }),
			new FileAppender({
				                 filePath: 'logs/error.log',
				                 level   : LogLevel.ERROR,
			                 }),
		])
	}
}


export const __logger = (name?: string) => new CombinedLogger(name)
