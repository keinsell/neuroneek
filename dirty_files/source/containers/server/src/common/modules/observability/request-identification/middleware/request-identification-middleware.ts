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

import {
	Inject,
	Injectable,
	type NestMiddleware,
}                                          from '@nestjs/common'
import {nanoid}                            from 'nanoid'
import type {
	ExpressRequest,
	ExpressResponse,
}                                          from '../../../../../types/express-response.js'
import type {UniqueIdentifier}             from '../../../../libraries/identification/index.js'
import type {RequestIdModuleOptions}       from '../config/request-id.config.js'
import {REQUEST_ID_HEADER}                 from '../constant/REQUEST_ID_HEADER.js'
import {REQUEST_ID_SERVICE}                from '../constant/REQUEST_ID_SERVICE.js'
import {REQUEST_ID_MODULE_OPTIONS_TOKEN}   from '../module/request-identificatiion-module-definition.js'
import type {RequestIdentificationService} from '../service/request-identification-service.js'



@Injectable()
export class RequestIdentificationMiddleware
	implements NestMiddleware
{
	constructor(@Inject(REQUEST_ID_SERVICE) private readonly service: RequestIdentificationService, @Inject(REQUEST_ID_MODULE_OPTIONS_TOKEN) private readonly options: RequestIdModuleOptions)
	{
	}

	use(req: ExpressRequest, res: ExpressResponse, next: () => void): void
	{
		let requestId: UniqueIdentifier

		// Use generator provided by options or use a default generator
		if (this.options.generator)
		{
			requestId = this.options.generator()
		}
		else
		{
			requestId = nanoid(128)
		}

		// Set Request ID to headers
		req.headers[REQUEST_ID_HEADER] = requestId as any
		res.setHeader(REQUEST_ID_HEADER, requestId)

		// Set Request ID to CLS
		this.service.requestId = requestId

		next()
	}
}
