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
  getNodeAutoInstrumentations,
  getResourceDetectors,
  InstrumentationConfigMap,
}                                          from '@opentelemetry/auto-instrumentations-node'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { W3CTraceContextPropagator }       from '@opentelemetry/core'
import { OTLPTraceExporter }               from '@opentelemetry/exporter-trace-otlp-grpc'
import { Resource }                        from '@opentelemetry/resources'
import {
  AggregationTemporality,
  InMemoryMetricExporter,
  PeriodicExportingMetricReader,
}                                          from '@opentelemetry/sdk-metrics'
import {
  BatchSpanProcessor,
  TraceIdRatioBasedSampler,
}                                          from '@opentelemetry/sdk-trace-base'
import PrismaInstrumentation               from '@prisma/instrumentation'
import type { OpentelemetryConfiguration } from '../../common/modules/observability/tracing/opentelemetry/config/opentelemetry-configuration.js'
import { __config }                        from '../global/__config.js'



export const OPENTELEMTRY_CONFIGURATION : OpentelemetryConfiguration = {
  serviceName         : __config.get( 'SERVICE_NAME' ),
  traceAutoInjectors  : [
	 //	 ControllerInjector,
	 //	 DecoratorInjector,
	 //	 GuardInjector,
	 //	 EventEmitterInjector,
	 //	 ScheduleInjector,
	 //	 PipeInjector,
	 //	 LoggerInjector,
	 //	 GraphQLResolverInjector,
  ],
  autoDetectResources : true,
  resourceDetectors   : [
	 ...getResourceDetectors(),
  ],
  contextManager      : new AsyncLocalStorageContextManager(),
  resource            : new Resource( {
													 lib : '@mph/opentelemetry',
												  } ),
  instrumentations    : [
	 getNodeAutoInstrumentations( {
											  '@opentelemetry/instrumentation-fs'  : {enabled : false},
											  '@opentelemetry/instrumentation-dns' : {enabled : false},
											} as InstrumentationConfigMap ), new PrismaInstrumentation.PrismaInstrumentation( {
																																							middleware : true,
																																							enabled    : true,
																																						 } ),
  ],
  sampler             : new TraceIdRatioBasedSampler(),
  traceExporter       : new OTLPTraceExporter(),
  spanProcessor       : new BatchSpanProcessor( new OTLPTraceExporter() as any ) as any,
  textMapPropagator   : new W3CTraceContextPropagator(),
  metricReader        : new PeriodicExportingMetricReader( {
																				 exporter : new InMemoryMetricExporter(
																					AggregationTemporality.CUMULATIVE ),
																			  } ) as any,
}
