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

import {Logger} from '@nestjs/common'



export class AggregateLogger {
	private readonly logger: Logger
	private aggregateVersion: string
	private aggregateId: string


	constructor(entity: any) {
		this.aggregateId      = entity.id
		this.aggregateVersion = entity.version.toString()
		const aggregateName   = entity.constructor.name.toLowerCase()

		this.logger = new Logger(aggregateName)
	}


	log(message: string) {
		this.logger.log(`${message}`, {
			aggregateId:      this.aggregateId,
			aggregateVersion: this.aggregateVersion,
		})
	}


	verbose(message: string) {
		this.logger.verbose(`${message}`, {
			aggregateId:      this.aggregateId,
			aggregateVersion: this.aggregateVersion,
		})
	}


	debug(message: string) {
		this.logger.debug(`${message}`, {
			aggregateId:      this.aggregateId,
			aggregateVersion: this.aggregateVersion,
		})
	}
}