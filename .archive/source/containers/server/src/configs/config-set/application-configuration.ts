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

import convict     from 'convict'
import {ConfigSet} from '../contract/config-set.js'
import {isTest}    from '../helper/is-test.js'


// TODO: Test Container feature should lookup availability of ex. database or redis before running test-container.

export interface IApplicationConfiguration
	extends ConfigSet
{
	/** Defines if application should ensure seed in a database */
	RUN_SEED: boolean
	/** Defines endpoint on which OpenAPI 3.0 Specification/UI should be exposed */
	OPENAPI_ENDPOINT: string
	/**
	 * Represents the HTTP endpoint for health check.
	 *
	 * @type {string}
	 */
	HEALTHCHECK_ENDPOINT: string
	PRISMA_ADMIN_PORT: number
	FEATURE_USE_DOCKER_TESTCONTAINERS: boolean
}


export const ApplicationConfigurationSchema: convict.Schema<IApplicationConfiguration> = {
	RUN_SEED                         : {
		default: false,
		format : Boolean,
	},
	FEATURE_USE_DOCKER_TESTCONTAINERS: {
		default: isTest() || false,
		format : Boolean,
	},
	OPENAPI_ENDPOINT                 : {
		default: '/api',
	},
	HEALTHCHECK_ENDPOINT             : {
		default: '/health',
	},
	PRISMA_ADMIN_PORT                : {
		format : 'port',
		default: 5555,
	},
}
