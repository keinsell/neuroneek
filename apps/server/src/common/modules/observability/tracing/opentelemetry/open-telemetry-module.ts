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
  DynamicModule,
  FactoryProvider,
}                                          from '@nestjs/common'
import { ModuleRef }                       from '@nestjs/core'
import { EventEmitterModule }              from '@nestjs/event-emitter'
import otelApi                             from '@opentelemetry/api'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { NodeSDK }                         from '@opentelemetry/sdk-node'
import { Tracer }                          from '@opentelemetry/sdk-trace-node'
import {
  SentryPropagator,
  SentrySampler,
  SentrySpanProcessor,
  setOpenTelemetryContextAsyncContextStrategy,
  setupEventContextTrace,
  wrapContextManagerClass,
}                                          from '@sentry/opentelemetry'
import { __sentryHub }                     from '../../../resources/sentry-v2/global/get-sentry.js'
import type { AutomaticTraceInjector }     from '../../automatic-tracing/contract/automatic-trace-injector/automatic-trace-injector.js'
import { DecoratorInjector }               from '../../automatic-tracing/provider/automatic-tracer/decorator-injector.js'
import type { OpentelemetryConfiguration } from './config/opentelemetry-configuration.js'
import { OPEN_TELEMETRY_SDK }              from './constant/OPEN_TELEMETRY_SDK.js'
import { OPEN_TELEMETRY_SDK_CONFIG }       from './constant/OPEN_TELEMETRY_SDK_CONFIG.js'
import { OPEN_TELEMETRY_SDK_INJECTORS }    from './constant/OPEN_TELEMETRY_SDK_INJECTORS.js'
import { OpentelemetryModuleAsyncOptions } from './interfaces/opentelemetry-module-async-options.js'
import { OpentelemetryTracer }             from './provider/tracer/opentelemetry-tracer.js'
import { OpenTelemetryService }            from './service/open-telemetry-service.js'



// @InitializeModuleAfter(SentryModule)
/**
 * forRoot()
 *
 * Configures the OpenTelemetryModule asynchronously.
 *
 * @param configuration - Configuration options for the module. See OpenTelemetryModuleConfig.
 * @returns A dynamic NestJS module with OpenTelemetry configured.
 *
 * - Imports EventEmitterModule
 * - Provides TraceService, OpenTelemetryService, DecoratorInjector
 * - Builds provider, injectors, and tracer based on configuration
 * - Exports TraceService and Tracer
 *
 * forRootAsync()
 *
 * Configures the OpenTelemetryModule asynchronously.
 *
 * @param configuration - Async configuration options. See OpentelemetryModuleAsyncOptions.
 * @returns A dynamic NestJS module with OpenTelemetry configured.
 *
 * - Imports EventEmitterModule and optionally other modules
 * - Provides TraceService, OpenTelemetryService
 * - Builds async provider, injectors, and tracer based on configuration
 * - Exports TraceService and Tracer
 *
 * buildProvider()
 *
 * Builds the OpenTelemetry SDK provider.
 *
 * @param configuration - The module configuration.
 * @returns A provider for the SDK.
 *
 * buildInjectors()
 *
 * Builds the injectors provider.
 *
 * @param configuration - The module configuration.
 * @returns A provider that runs the injectors.
 *
 * buildAsyncProvider()
 *
 * Builds the async OpenTelemetry SDK provider.
 *
 * @returns An async provider for the SDK.
 *
 * buildAsyncInjectors()
 *
 * Builds the async injectors provider.
 *
 * @param config - The module config
 * @param moduleRef - A reference to the module
 * @returns An async provider that runs the injectors.
 *
 * buildTracer()
 *
 * Builds a provider for the Tracer service.
 *
 * @returns A tracer provider.
 *
 */

export class OpenTelemetryModule
  {
	 /**
	  * Initializes the OpenTelemetry module with the given configuration.
	  *
	  * @param {Partial<OpenTelemetryModuleConfig>} configuration - The configuration for the OpenTelemetry module.
	  *     (optional)
	  *
	  * @return {Promise<DynamicModule>} A Promise that resolves to a DynamicModule object representing the
	  *     OpenTelemetry module.
	  */
	 static async forRoot(configuration : Partial<OpentelemetryConfiguration> = {}) : Promise<DynamicModule>
		{
		  configuration   = {...configuration} as any
		  const injectors = configuration?.traceAutoInjectors ?? []
		  return {
			 global    : true,
			 module    : OpenTelemetryModule,
			 imports   : [ EventEmitterModule.forRoot() ],
			 providers : [
				...injectors,
				OpentelemetryTracer,
				OpenTelemetryService,
				DecoratorInjector,
				this.buildProvider( configuration ),
				this.buildInjectors( configuration ),
				this.buildTracer(),
				{
				  provide  : OPEN_TELEMETRY_SDK_CONFIG,
				  useValue : configuration,
				},
			 ],
			 exports   : [
				OpentelemetryTracer, Tracer,
			 ],
		  }
		}

	 /**
	  * Initialize the OpenTelemetry module asynchronously.
	  *
	  * @param {OpentelemetryModuleAsyncOptions} configuration - The configuration options for the module. Default is an
	  *     empty object.
	  * @returns {Promise<DynamicModule>} - A Promise that resolves to a DynamicModule object.
	  */
	 static async forRootAsync(configuration : OpentelemetryModuleAsyncOptions = {}) : Promise<DynamicModule>
		{
		  return {
			 global    : true,
			 module    : OpenTelemetryModule,
			 imports   : [
				...configuration?.imports as any, EventEmitterModule.forRoot(),
			 ],
			 providers : [
				OpentelemetryTracer,
				OpenTelemetryService,
				this.buildAsyncProvider(),
				this.buildAsyncInjectors(),
				this.buildTracer(),
				{
				  provide    : OPEN_TELEMETRY_SDK_CONFIG,
				  useFactory : configuration.useFactory as any,
				  inject     : configuration.inject,
				},
			 ],
			 exports   : [
				OpentelemetryTracer, Tracer,
			 ],
		  }
		}

	 /**
	  * Builds a factory provider for the OpenTelemetry SDK.
	  *
	  * @param {Partial<OpenTelemetryModuleConfig>} configuration - The optional configuration for the SDK.
	  * @return {FactoryProvider} - The factory provider object.
	  */
	 private static buildProvider(configuration? : Partial<OpentelemetryConfiguration>) : FactoryProvider
		{
		  return {
			 provide    : OPEN_TELEMETRY_SDK,
			 useFactory : async () => {


				let conf = {...configuration}

				if ( __sentryHub?.getClient() )
				  {
					 setupEventContextTrace( __sentryHub.getClient() as any )

					 const SentryContextManager = wrapContextManagerClass( AsyncLocalStorageContextManager )

					 conf = {
						...configuration,
						spanProcessor     : new SentrySpanProcessor() as any,
						contextManager    : new SentryContextManager(),
						textMapPropagator : new SentryPropagator(),
						sampler           : new SentrySampler( __sentryHub.getClient() as any ),
					 }
				  }

				const sdk = new NodeSDK( conf )

				if ( __sentryHub.getClient() as any )
				  {
					 setOpenTelemetryContextAsyncContextStrategy()
					 otelApi.propagation.setGlobalPropagator( new SentryPropagator() )
				  }

				sdk.start()

				return sdk
			 },
		  }
		}

	 private static async executeInjectorMethods(...injectors : AutomaticTraceInjector[]) : Promise<void>
		{
		  for await ( const injector of injectors )
			 {
				if ( injector[ 'inject' ] ) await injector.inject()
			 }
		}

	 private static buildInjectors(config? : Partial<OpentelemetryConfiguration>) : FactoryProvider
		{
		  const injectors    = config?.traceAutoInjectors ?? []
		  const dependencies = [
			 DecoratorInjector, ...( injectors as [] ),
		  ]

		  return {
			 provide    : OPEN_TELEMETRY_SDK_INJECTORS,
			 useFactory : this.executeInjectorMethods,
			 inject     : dependencies,
		  }
		}

	 private static buildAsyncProvider() : FactoryProvider
		{
		  return {
			 provide    : OPEN_TELEMETRY_SDK,
			 useFactory : async (config) => {
				config    = {...config}
				const sdk = new NodeSDK( config )

				sdk.start()

				return sdk
			 },
			 inject     : [ OPEN_TELEMETRY_SDK_CONFIG ],
		  }
		}

	 private static buildAsyncInjectors() : FactoryProvider
		{
		  return {
			 provide    : OPEN_TELEMETRY_SDK_INJECTORS,
			 useFactory : async (
				config,
				moduleRef : ModuleRef,
			 ) => {
				config          = {...config}
				const injectors = config.traceAutoInjectors

				const decoratorInjector = await moduleRef.create( DecoratorInjector )

				decoratorInjector.inject()

				for await ( const injector of injectors )
				  {
					 const created = await moduleRef.create( injector )
					 if ( created[ 'inject' ] ) await created.inject()
				  }

				return {}
			 },
			 inject     : [
				OPEN_TELEMETRY_SDK_CONFIG, ModuleRef,
			 ],
		  }
		}

	 private static buildTracer()
		{
		  return {
			 provide    : Tracer,
			 useFactory : (traceService : OpentelemetryTracer) => traceService.getTracer(),
			 inject     : [ OpentelemetryTracer ],
		  }
		}
  }