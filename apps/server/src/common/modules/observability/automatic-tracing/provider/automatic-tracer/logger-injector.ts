/*
 * MIT License
 *
 * Copyright (c) 2023 Jakub Olan <keinsell@protonmail.com>
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

import {ConsoleLogger, Injectable} from '@nestjs/common'
import {context, trace}            from '@opentelemetry/api'
import {AutomaticTraceInjector}    from '../../contract/automatic-trace-injector/automatic-trace-injector.js'



@Injectable()
export class LoggerInjector implements AutomaticTraceInjector {
	private static getMessage(message: string) {
		const currentSpan = trace.getSpan(context.active())

		if (!currentSpan) return message

		const spanContext = trace.getSpan(context.active())?.spanContext()

		currentSpan.addEvent(message)

		return `[${spanContext?.traceId}] ${message}`
	}


	public async inject() {
		ConsoleLogger.prototype.log     = this.wrapPrototype(ConsoleLogger.prototype.log)
		ConsoleLogger.prototype.debug   = this.wrapPrototype(ConsoleLogger.prototype.debug)
		ConsoleLogger.prototype.error   = this.wrapPrototype(ConsoleLogger.prototype.error)
		ConsoleLogger.prototype.verbose = this.wrapPrototype(ConsoleLogger.prototype.verbose)
		ConsoleLogger.prototype.warn    = this.wrapPrototype(ConsoleLogger.prototype.warn)
	}


	private wrapPrototype(prototype: ConsoleLogger[keyof ConsoleLogger]) {
		return {
			[prototype.name]: function (...args: any[]) {
				args[0] = LoggerInjector.getMessage(args[0])
				prototype.apply(this, args)
			},
		}[prototype.name]
	}
}