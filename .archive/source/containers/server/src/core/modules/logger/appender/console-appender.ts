import chalk         from 'chalk';
import {LogAppender} from "../log-appender.js"
import {LogLevel}    from "../log-level.js"
import {Log}         from "../log.js"



export class ConsoleAppender extends LogAppender {
	private static getColorForLogLevel(logLevel: LogLevel): string {
		switch (logLevel) {
			case LogLevel.TRACE:
			case LogLevel.DEBUG:
				return 'gray';
			case LogLevel.INFO:
				return 'green';
			case LogLevel.WARN:
				return 'yellow';
			case LogLevel.ERROR:
			case LogLevel.FATAL:
				return 'red';
			default:
				return 'white';
		}
	}


	append(log: Log): void {
		const level   = log.level.toUpperCase();
		const color   = ConsoleAppender.getColorForLogLevel(log.level);
		const message = (
			chalk as any
		)[color](`${log.timestamp}: ${log.message}`);

		switch (log.level) {
			case LogLevel.TRACE:
				if (log.metadata?.data) {
					console.log(chalk.white('TRACE ', message), chalk.gray(JSON.stringify(log.metadata?.data)));
				} else {
					console.log(chalk.white('TRACE ', message));
				}
				break;
			case LogLevel.DEBUG:

				if (log.metadata?.data) {
					console.log(`${chalk.white('DEBUG')}`, message, chalk.gray(JSON.stringify(log.metadata?.data)));
				} else {
					console.log(`${chalk.white('DEBUG', message)}`);
				}
				break;
			case LogLevel.INFO:
				if (log.metadata?.data) {
					console.log(`${chalk.green('INFO')}`, message, chalk.gray(JSON.stringify(log.metadata?.data)));
				} else {
					console.log(`${chalk.green('INFO')}`, message);
				}
				break;
			case LogLevel.WARN:
				if (log.metadata?.data) {
					console.warn(`${chalk.yellow('WARN')}`, message, chalk.gray(JSON.stringify(log.metadata?.data)));
				} else {
					console.warn(`${chalk.yellow('WARN')}`, message);
				}
				break;
			case LogLevel.ERROR:
				console.error(`${chalk.red('ERROR')}`, message, log.metadata?.error);
				break;
			case LogLevel.FATAL:
				console.error(`${chalk.red('FATAL')}`, message, log.metadata?.error);
				break;
			default:
				console.log(message, log.metadata?.data);
				break;
		}
	}
}