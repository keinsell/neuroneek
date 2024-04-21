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

import {ApiProperty} from '@nestjs/swagger'
import {ApiModel}    from '../../../utilities/docs-utils/swagger-api-model.js'
import {HttpStatus}  from '../../http-status.js'
import {Exception}   from '../../libraries/error-registry/error.js'



// I see multiple people just do this like this: pl.stepapp.account.already-exists
// Does not really matter, the thing that matters it's a unique id for the error on
// which end-user of API can predicate what happened and how to handle such.
export const ApiHttpProblemType = ApiProperty({
	                                              type       : String,
	                                              description: 'A URI reference that uniquely identifies the problem type only in the context of the provided API. Opposed to the specification in RFC-7807, it is neither recommended to be dereferencable and point to a human-readable documentation nor globally unique for the problem type.',
	                                              example    : 'com.app.account.already-exists',
                                              })


@ApiModel({
	          name: 'Problem',
          })
export class HttpProblem
	extends Exception
	{
		/** A URI reference [RFC3986](https://tools.ietf.org/html/rfc3986) that identifies the problem type. */
		@ApiHttpProblemType type: string

		// Should be i18n
		@ApiProperty({
			             type       : String,
			             description: 'A short, human-readable summary of the problem type.',
			             example    : 'Account already exists',
		             }) title: string

		@ApiProperty({
			             type       : 'int',
			             minimum    : 100,
			             maximum    : 599,
			             enum       : HttpStatus,
			             description: 'No rocket science there.',
			             example    : HttpStatus.BAD_REQUEST,
		             }) status: HttpStatus

		// Should be i18n
		@ApiProperty({
			             type       : String,
			             description: 'A human-readable explanation specific to this occurrence of the problem.',
			             example    : 'The account you are trying to register, already exists.',
		             }) detail: string


		// It's in the spec but I do not see how to apply it in suitable pattern
		// This should tell end user on which resource error have happened
		// like id of error or smth.
		@ApiProperty({
			             type       : String,
			             description: 'A URI reference that identifies the specific occurrence of the problem. It may or may not yield further information if dereferenced.',
			             example    : 'com.app.account.already-exists',
		             }) instance: string

		constructor(
data: {
	type: string
	title: string
	status: HttpStatus
	instance: string
	message: string
	metadata?: Record<string, any>
}
		)
		{
			const {
				      type,
				      title,
				      status,
				      instance,
				      message,
				      metadata,
			      } = data

			super(
				type,
				title,
				message
			)

			this.type     = type
			this.title    = title
			this.status   = status
			this.instance = instance
}
	}
