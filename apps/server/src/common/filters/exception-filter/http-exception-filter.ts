/*
 * MIT License
 *
 * Copyright (c) 2024 Jakub Olan <keinsell@protonmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
}                          from '@nestjs/common'
import {HttpArgumentsHost} from '@nestjs/common/interfaces'
import {HttpAdapterHost}                      from '@nestjs/core'
import {GqlArgumentsHost, GqlExceptionFilter} from "@nestjs/graphql"
import {Request}                              from 'express'
import {
	getCode,
	getErrorMessage,
	getObjectValue,
}                          from './dirty-utilities.js'



/**
 * Catch and format thrown exception in NestJS application based on Express
 */
@Catch()
export class HttpExceptionFilter
	implements ExceptionFilter
{
	private readonly logger: Logger = new Logger(HttpExceptionFilter.name)


	constructor(public httpAdapterHost: HttpAdapterHost)
	{
	}


	/**
	 * Catch and format thrown exception
	 */
	public catch(exception: unknown, host: ArgumentsHost): void
	{
		const ctx: HttpArgumentsHost = host.switchToHttp()
		const request: Request       = ctx.getRequest()
		let status: number

		this.logger.debug(`Catching exception with HttpExceptionFilter`, exception)

		if (exception instanceof HttpException)
		{
			status = exception.getStatus()
		}
		else
		{
			const type: string | undefined = getObjectValue(exception, 'type')
			status                         = type === 'entity.too.large' ? HttpStatus.PAYLOAD_TOO_LARGE
			                                                             : HttpStatus.INTERNAL_SERVER_ERROR
		}

		let code: string    = exception instanceof HttpException ? getCode(exception.getResponse())
		                                                         : HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR]
		let message: string = exception instanceof HttpException ? getErrorMessage(exception.getResponse())
		                                                         : 'An internal server error occurred'

		if (status === HttpStatus.PAYLOAD_TOO_LARGE)
		{
			code    = HttpStatus[HttpStatus.PAYLOAD_TOO_LARGE]
			message = `
      Your request entity size is too big for the server to process it:
        - request size: ${getObjectValue(exception, 'length')};
        - request limit: ${getObjectValue(exception, 'limit')}.`
		}

		const exceptionStack: any = 'stack' in (
			exception as any
		) ? (
			                            exception as any
		                            ).stack : ''

		if (status >= HttpStatus.INTERNAL_SERVER_ERROR)
		{
			this.logger.error(`${status} [${request.method} ${request.url}] has thrown a critical error: ${exceptionStack}`)
		}
		else
		{
			if (status >= HttpStatus.BAD_REQUEST)
			{
				this.logger.warn(`${status} [${request.method} ${request.url}] has thrown an HTTP client error: ${exceptionStack}`, exception)
			}
		}

		const response = ctx.getResponse()
		response
			.status(status)
			.json({
				      statusCode: status,
				      timestamp : new Date().toISOString(),
				      path      : this.httpAdapterHost?.httpAdapter.getRequestUrl(ctx.getRequest()),
				      method    : request.method,
				      code      : code,
				      message   : message,
			      })
	}
}


@Catch()
export class GraphQLErrorFilter implements GqlExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const gqlHost = GqlArgumentsHost.create(host);
		// handle the exception here
		return exception;
	}
}