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

import convict                          from 'convict'
import {ApplicationConfigurationSchema} from '../config-set/application-configuration.js'
import {AuthroizationConfiguration}     from '../config-set/authorization-configuration.js'
import {ConfigurationContainer}         from '../schema/configuration-container.js'
import {NodeEnvironment}                from '../values/node-environment.js'
import {RedisConfiguration}             from './redis-configuration.js'



export const MainConfiguration: convict.Schema<ConfigurationContainer> = {
	PROTOCOL           : {
		doc    : 'Defines the protocol used by the application. Options are \'http\' or \'https\'. Default is \'http\'.',
		default: 'http',
		env    : 'PROTOCOL',
	},
	HOST               : {
		doc    : 'Defines the host on which the application runs. Default for development is \'localhost\'.',
		default: 'localhost',
		env    : 'HOST',
	},
	PORT               : {
		doc    : 'Defines the port on which the application listens. Default for development is 1337, otherwise it\'s 80.',
		default: 1337,
		env    : 'PORT',
		format : 'port',
	},
	SERVICE_NAME       : {
		doc    : 'Defines the name of the service. Default is \'methylphenidate\'.',
		default: 'methylphenidate',
		env    : 'SERVICE_NAME',
	},
	SERVICE_DESCRIPTION: {
		doc    : 'Provides a brief description of the service. Default description is set.',
		default: 'Methylphenidate is a boilerplate for Nest.js applications with batteries included.',
		env    : 'SERVICE_DESCRIPTION',
	},
	NODE_ENV           : {
		doc    : 'Sets the application environment. Can be one of \'development\', \'test\', \'production\', or \'staging\'. Default is \'development\'.',
		default: 'development',
		env    : 'NODE_ENV',
		format : Object.values(NodeEnvironment),
	},
	TRACING            : {
		doc    : 'Enables or disables OpenTelemetry tracing, which traces requests and responses between services and applications. Default is enabled.',
		default: true,
		env    : 'TRACING',
	},
	SENTRY_DSN         : {
		doc    : 'Defines the Sentry DSN. Default is empty.',
		default: '',
		env    : 'SENTRY_DSN',
	},
	DEBUG              : {
		doc    : 'Enables or disables debug mode. Default is disabled.',
		default: false,
		env    : 'DEBUG',
	},
	APPLICATION        : ApplicationConfigurationSchema,
	AUTH               : AuthroizationConfiguration,
	FEATURE            : {
		ENABLE_TUNNEL: {
			doc    : 'Enables or disables the tunnel feature',
			default: true,
		},
	},
	redis              : RedisConfiguration,
}
