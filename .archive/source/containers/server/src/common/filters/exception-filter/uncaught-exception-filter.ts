import {ArgumentsHost, Catch, Injectable}     from "@nestjs/common"
import {BaseExceptionFilter, HttpAdapterHost} from "@nestjs/core"



@Catch() @Injectable()
export class UncaughtExceptionFilter extends BaseExceptionFilter {
	constructor(httpAdapterHost: HttpAdapterHost) {
		const instance = httpAdapterHost.httpAdapter.getInstance();
		super(instance);
	}


	/**
	 * Catch and format thrown exception
	 */
	public catch(exception: unknown, host: ArgumentsHost): void {
		super.catch(exception, host);
	}

}