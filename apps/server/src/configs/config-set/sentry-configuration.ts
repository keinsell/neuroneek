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

import Sentry          from '@sentry/node'
import {__config}      from '../global/__config.js'
import {isDevelopment} from '../helper/is-development.js'
import {isTest}        from '../helper/is-test.js'



export interface ISentryConfiguration
	extends Sentry.NodeOptions
{
}


export const SENTRY_CONFIGURATION: ISentryConfiguration = {
	// Sentry is automatically reading DSN from environment variable SENTRY_DSN
	// There is no need to set it manually
	//	dsn:                 __config.get('SENTRY_DSN'),
	autoSessionTracking: true,
	tracesSampleRate   : isDevelopment() || isTest() ? 1 : 0.1,
	profilesSampleRate : isDevelopment() || isTest() ? 1 : 0.1,
	sampleRate         : 1,
	enabled            : true,
	enableTracing      : true,
	debug              : false,
	instrumenter       : 'otel',
	environment        : __config.get('NODE_ENV'),
	attachStacktrace   : true, //  includeLocalVariables : true,
}
