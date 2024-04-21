import {ApiModel}                   from '../../../../utilities/docs-utils/swagger-api-model.js'
import {ApiPropertyAccountPassword} from '../../../account/value-objects/password.js'
import {ApiPropertyAccountUsername} from '../../../account/value-objects/username.js'



@ApiModel({
	          name       : 'Auhenticate',
	          description: 'asdasd',
          })
export class AuthenticateCommand
	{
		/**
		 * Represents a username.
		 * @typedef {string} username
		 */
		@ApiPropertyAccountUsername username: string

		/**
		 * The password variable is a string that represents a user's password.
		 *
		 * @type {string}
		 */
		@ApiPropertyAccountPassword password: string
	}