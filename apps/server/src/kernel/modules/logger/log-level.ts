export enum LogLevel {
	/** For tracing purposes. */
	TRACE = 'trace',
	/** For debugging purposes. */
	DEBUG = 'debug',
	/** For informational messages. */
	INFO  = 'info',
	/** For warnings. */
	WARN  = 'warn',
	/** For errors. */
	ERROR = 'error',
	/** For fatal errors. */
	FATAL = 'fatal',
}


export const LogLevelCode: {
	[key in LogLevel]: number;
} = {
	[LogLevel.TRACE]: 0,
	[LogLevel.DEBUG]: 100,
	[LogLevel.INFO]:  200,
	[LogLevel.WARN]:  400,
	[LogLevel.ERROR]: 500,
	[LogLevel.FATAL]: 600,
}