import {faker}                      from '@faker-js/faker'
import {ApiProperty}                from '@nestjs/swagger'
import {ApiAccountMockup}           from '../../../utilities/fixtures/api-account-mockup.js'
import {ApiPropertyAccountUsername} from '../value-objects/username.js'



export class CreateAccountDto {
	/**
	 * Represents the unique identifier of an entity.
	 *
	 * @typedef {string} Id
	 */
	@ApiProperty({
		name       : 'id',
		description: 'The domain\'s unique identifier',
		example    : '',
		required   : false,
	}) id?: string

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
	 * The password variable is a string that represents a user's password.
	 *
	 * @type {string}
	 */
	@ApiProperty({
		name       : 'password',
		description: 'The domain\'s password',
		example    : ApiAccountMockup.password,
		examples   : ApiAccountMockup._examples.passwords,
	}) password: string

	/**
	 * Represents a username.
	 * @typedef {string} username
	 */
	@ApiPropertyAccountUsername username: string
}
