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

import {Module}                      from '@nestjs/common'
import {OPENTELEMTRY_CONFIGURATION}  from '../../../configs/config-set/opentelemetry-configuration.js'
import {SENTRY_CONFIGURATION}        from "../../../configs/config-set/sentry-configuration.js"
import {SentryModule}                from "../resources/sentry-v2/sentry-module.js"
import {RequestIdentificationModule} from './request-identification/index.js'
import {OpenTelemetryModule}         from './tracing/opentelemetry/open-telemetry-module.js'



@Module({
	imports: [
		RequestIdentificationModule.register({}), SentryModule.forRoot(SENTRY_CONFIGURATION),
		OpenTelemetryModule.forRoot(OPENTELEMTRY_CONFIGURATION),
	],
	exports: [],
})
export class ObservabilityModule {
}
