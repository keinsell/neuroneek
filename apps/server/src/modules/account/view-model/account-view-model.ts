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

import {faker}                      from '@faker-js/faker'
import {ApiProperty}                from '@nestjs/swagger'
import {ApiModel}                   from '../../../utilities/docs-utils/swagger-api-model.js'
import {ApiAccountMockup}           from '../../../utilities/fixtures/api-account-mockup.js'
import {ApiPropertyAccountUsername} from '../value-objects/username.js'



@ApiModel({
	name       : 'Account',
	description: 'asdasd',
})
export class AccountViewModel {
	/**
	 * Represents the unique identifier of an entity.
	 *
	 * @typedef {string} Id
	 */
	@ApiProperty({
		name       : 'id',
		description: 'The domain\'s unique identifier',
		example    : 'cjld2cjxh0000qzrmn831i7rn',
		required   : true,
	}) id: string

	/**
	 * Represents an email address.
	 * @typedef {string} email
	 */
	@ApiProperty({
		name       : 'email',
		description: 'The domain\'s email address',
		example    : ApiAccountMockup.email,
		examples   : ApiAccountMockup._examples.emails,
	}) email: string

	/**
	 * Indicates whether the email associated with a user domain has been verified.
	 *
	 * @type {boolean}
	 */
	@ApiProperty({
		name       : 'emailVerified',
		description: 'Indicates whether the email associated with a user domain has been verified',
		example    : faker.datatype.boolean(),
	}) emailVerified: boolean

	/**
	 * Represents a username.
	 * @typedef {string} username
	 */
	@ApiPropertyAccountUsername username: string
}
