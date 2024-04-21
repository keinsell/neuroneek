import {Log} from "./log.js";



export abstract class LogAppender {
	abstract append(log: Log): Promise<void> | void;
}