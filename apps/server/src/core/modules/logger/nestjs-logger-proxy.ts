//import {Logger} from '@nestjs/common';
//
//
//

import {Injectable, LoggerService, LogLevel} from '@nestjs/common';
import {CombinedLogger, Logger, LogMetadata} from "./logger.js"


// TODO: Logger is not parsing context well, this should be investigated.

@Injectable()
export class LoggerNestjsProxy implements LoggerService {
	private logger: Logger;


	constructor(name?: string) {
		this.logger = new CombinedLogger(name)
	}


	verbose?(message: any, ...optionalParams: any[]) {
		this.logger.trace(message, this.parseMetadataFromLog(optionalParams))
	}


	setLogLevels?(levels: LogLevel[]) {}


	public debug(message: any, ...optionalParams: any[]): any {
		this.logger.debug(message, this.parseMetadataFromLog(optionalParams))
	}


	public error(message: any, ...optionalParams: any[]): any {
		this.logger.error(message, this.parseMetadataFromLog(optionalParams))
	}


	public fatal(message: any, ...optionalParams: any[]): any {
		this.logger.fatal(message, this.parseMetadataFromLog(optionalParams))
	}


	public log(message: any, ...optionalParams: any[]): any {
		this.logger.info(message, this.parseMetadataFromLog(optionalParams))
	}


	public warn(message: any, ...optionalParams: any[]): any {
		this.logger.warn(message, this.parseMetadataFromLog(optionalParams))
	}


	private parseMetadataFromLog(...params: any[]): LogMetadata {
		// Assume default logs from nodejs ex. { params: [ [ [Object], 'Bootstrap' ] ] }
		// Extract string context to variable.
		// It seems context is always the last parameter.

		let context = params[0][params[0].length - 1]

		// If context is string, then it's probably a context.
		// As data is not passed to logs as plain primitives.
		if (typeof context === "string") {
			params[0].pop()
		}

		// Assume the params provided are unknown datatype.
		// Attach them to LogMetadata.data object.
		// This is a workaround to pass data to logs.

		const metadata = {
			context: context,
			data:    params[0]?.[0] || {},
		}

		// Do not pass empty data to logs.
		// This is a workaround to filter out empty data.

		if (params[0].length === 0) {
			delete metadata.data
		}

		return metadata
	}

}