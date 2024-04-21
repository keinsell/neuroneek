import {LogAppender} from "../log-appender.js"
import {Log}         from "../log.js";



export class SyslogAppender extends LogAppender {
	constructor() {
		super();
	}


	append(log: Log) {
	}
}