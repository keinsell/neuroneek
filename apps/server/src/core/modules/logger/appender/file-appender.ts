import {pino}                   from "pino";
import {LogAppender}            from "../log-appender.js"
import {LogLevel, LogLevelCode} from "../log-level.js"
import {Log}                    from "../log.js";



export interface FileLogAppenderOptions {
	filePath: string;
	level?: LogLevel;
}


export class FileAppender extends LogAppender {
	private logger: pino.Logger;
	private filterLevel: LogLevel;


	constructor(options: FileLogAppenderOptions) {
		super();
		this.logger = pino(pino.destination(options.filePath));
	}


	append(log: Log): void {
		if (this.filterLevel) {
			if (LogLevelCode[this.filterLevel] > LogLevelCode[log.level]) {
				return;
			}
		}

		this.logger[log.level](log);
	}
}