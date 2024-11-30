import {Injectable}                      from "@nestjs/common"
import {NextFunction, Request, Response} from "express"
import {Logger}                          from "./logger.js"



@Injectable()
export class HttpLogger {
	private logger: Logger;


	constructor(logger: Logger) {
		this.logger = logger;
	}


	public logRequest(req: Request, res: Response, next: NextFunction): void {
		// TODO: Handle right status and use right log level per status.
		// 200 are info, 300-400 are warns, 500 are errors,
	}
}