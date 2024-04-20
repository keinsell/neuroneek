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

import type { SimplifyDeep } from 'type-fest/source/merge-deep.js'
import type { IPV4 }         from '../../../../../kernel/standard/ipv4.js'



/**
 * OpenTelemetry spans can be created freely and it’s up to the implementor to annotate them with attributes specific
 * to the represented operation. Spans represent specific operations in and between systems. Some of these operations
 * represent calls that use well-known protocols like HTTP or database calls. Depending on the protocol and the type of
 * operation, additional information is needed to represent and analyze a span correctly in monitoring systems. It is
 * also important to unify how this attribution is made in different languages. This way, the operator will not need to
 * learn specifics of a language and telemetry collected from polyglot (multi-language) micro-service environments can
 * still be easily correlated and cross-analyzed.
 * @see [OpenTelemtry's Trace Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/general/trace/)
 */
export type SpanAttribute = SimplifyDeep<{
  server : {
	 address : IPV4
	 port : number
  }
}>