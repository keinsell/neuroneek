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

import {IApplicationConfiguration}   from '../config-set/application-configuration.js'
import {IAuthorizationConfiguration} from '../config-set/authorization-configuration.js'



export interface IRedisConfiguration
{
	host: string
	port: number
	username: string | undefined
	password: string | undefined
	url: string | undefined
	enableOfflineQueue: boolean | undefined
	db: number | undefined
}


export interface ConfigurationContainer
{
	/** Defines the protocol used by the application. Options are 'http' or 'https'. Default is 'http'. */
	PROTOCOL: 'http' | 'https';

	/** Defines the host on which the application runs. Default for development is 'localhost'. */
	HOST: string | 'localhost';

	/** Defines the port on which the application listens. Default for development is 1337, otherwise it's 80. */
	PORT: number;

	/** Defines the name of the service. Default is 'methylphenidate'. */
	SERVICE_NAME: string;

	/** Provides a brief description of the service. Default description is set. */
	SERVICE_DESCRIPTION: string;

	/** Sets the application environment. Can be one of 'development', 'test', 'production', or 'staging'. Default is 'development'. */
	NODE_ENV: 'development' | 'test' | 'production' | 'staging';

	/** Enables or disables OpenTelemetry tracing, which traces requests and responses between services and applications. Default is enabled. */
	TRACING: boolean;

	/** Defines the Sentry DSN. Default is empty. */
	SENTRY_DSN: string;
	DEBUG: boolean;

	APPLICATION: IApplicationConfiguration
	AUTH: IAuthorizationConfiguration
	FEATURE: {
		ENABLE_TUNNEL: boolean
	}
	redis: IRedisConfiguration
}
