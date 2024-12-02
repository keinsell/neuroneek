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

import {Injectable}              from '@nestjs/common'
import Convict                   from 'convict'
import * as dotenv               from 'dotenv'
import {MainConfiguration}       from '../config-set/main-configuration.js'
import {ConfigurationContainer} from '../schema/configuration-container.js'



@Injectable()
export class ConfigurationService
{
	private config: Convict.Config<ConfigurationContainer>


	constructor()
	{
		this.config      = Convict(MainConfiguration)
		const dotEnvFile = dotenv.config().parsed

		if (dotEnvFile)
		{
			this.config.load(dotenv.config().parsed)
		}

		this.config.validate({
			                     allowed: 'warn',
			                     output : (message) =>
			                     {
				                     // Disabled for noop logging
				                     //											 const chunks = message.split( '\n'
				                     // )
				                     //											 chunks.forEach( (chunk) => {
				                     //												new Logger( 'config' ).verbose(
				                     // chunk ) } )
			                     },
		                     })
	}


	get<K extends keyof ConfigurationContainer>(key: K)
	{
		return this.config.get(key)
	}
}

