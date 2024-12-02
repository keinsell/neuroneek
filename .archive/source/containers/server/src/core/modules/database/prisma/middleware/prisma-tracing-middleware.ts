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

import {getCurrentScope}          from '@sentry/node'
import {startInactiveSpan}        from '@sentry/opentelemetry'
import {Prisma}                   from 'db'
import {LoggingMiddlewareOptions} from '../structures/prisma-logging-middleware-options.js'



export function prismaTracingMiddleware(args: LoggingMiddlewareOptions = {
	logger  : console,
	logLevel: 'debug',
}): Prisma.Middleware
{
	return async (params, next) =>
	{
		const {
			      model,
			      action,
			      runInTransaction,
			      args,
		      }           = params
		const description = [
			model,
			action,
		].filter(Boolean).join('.')

		const data = {
			model,
			action,
			runInTransaction,
			args,
		}

		const span = startInactiveSpan({
			                               startTime : Date.now(),
			                               name      : description.toLowerCase(),
			                               op        : 'db.prisma.query',
			                               attributes: {
				                               'op': 'db.prisma.query',
			                               },
		                               })

		getCurrentScope()?.addBreadcrumb({
			                                 category: 'db',
			                                 message : description,
			                                 data,
		                                 })

		const before = Date.now()
		const result = await next(params)

		const after = Date.now()

		const executionTime = after - before

		// eslint-disable-next-line no-console
		//console.log( `Prisma query: ${params.model}.${params.action}() in ${executionTime}ms` )

		span.setAttribute('query', description)
		span.setAttribute('model', params.model || '')
		span.setAttribute('execution_time', executionTime)
		span.end(after)

		return result
	}
}
