/*
 * MIT License
 *
 * Copyright (c) 2023 Jakub Olan <keinsell@protonmail.com>
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


import { Logger }                               from '@nestjs/common'
import { PATH_METADATA }                        from '@nestjs/common/constants.js'
import {
  Controller,
  Injectable,
}                                               from '@nestjs/common/interfaces'
import {
  MetadataScanner,
  ModulesContainer,
}                                               from '@nestjs/core'
import { InstanceWrapper }                      from '@nestjs/core/injector/instance-wrapper.js'
import {
  context,
  Span,
  SpanStatusCode,
  trace,
}                                               from '@opentelemetry/api'
import { OPEN_TELEMETRY_TRACE_METADATA }        from '../../../tracing/opentelemetry/constant/OPEN_TELEMETRY_TRACE_METADATA.js'
import { OPEN_TELEMETRY_TRACE_METADATA_ACTIVE } from '../../../tracing/opentelemetry/constant/OPEN_TELEMETRY_TRACE_METADATA_ACTIVE.js'



export class CoreAutomaticTracer
  {
	 protected readonly metadataScanner : MetadataScanner = new MetadataScanner()

	 constructor(protected readonly modulesContainer : ModulesContainer)
		{
		}

	 protected static recordException<T extends Error>(
		error : T,
		span : Span,
	 )
		{
		  span.recordException( error )
		  span.setStatus( {
								  code    : SpanStatusCode.ERROR,
								  message : error.message,
								} )
		  throw error
		}

	 protected* getControllers() : Generator<InstanceWrapper<Controller>>
		{
		  for ( const module of this.modulesContainer.values() )
			 {
				for ( const controller of module.controllers.values() )
				  {
					 if ( controller?.metatype?.prototype )
						{
						  yield controller
						}
				  }
			 }
		}

	 protected* getProviders() : Generator<InstanceWrapper<Injectable>>
		{
		  for ( const module of this.modulesContainer.values() )
			 {
				for ( const provider of module.providers.values() )
				  {
					 if ( provider?.metatype?.prototype )
						{
						  yield provider
						}
				  }
			 }
		}

	 protected isPath(prototype : Object) : boolean
		{
		  return Reflect.hasMetadata( PATH_METADATA, prototype )
		}

	 protected isAffected(prototype : Object) : boolean
		{
		  return Reflect.hasMetadata( OPEN_TELEMETRY_TRACE_METADATA, prototype )
		}

	 protected getTraceName(prototype : Object) : string
		{
		  return Reflect.getMetadata( OPEN_TELEMETRY_TRACE_METADATA, prototype )
		}

	 protected isDecorated(prototype : Object) : boolean
		{
		  return Reflect.hasMetadata( OPEN_TELEMETRY_TRACE_METADATA, prototype )
		}

	 protected reDecorate(
		source : Object,
		destination : Object,
	 )
		{
		  const keys = Reflect.getMetadataKeys( source )

		  for ( const key of keys )
			 {
				const meta = Reflect.getMetadata( key, source )
				Reflect.defineMetadata( key, meta, destination )
			 }
		}

	 protected wrap(
		prototype : Record<any, any>,
		traceName : string,
		attributes = {},
		operation? : string,
	 )
		{
		  const method = function (...args : any[]) {

			 new Logger().debug( `[${traceName}]` )

			 const tracer      = trace.getTracer( 'default' )
			 const currentSpan = tracer.startSpan( traceName )

			 let result : any

			 try
				{

				  result = context.with( trace.setSpan( context.active(), currentSpan ), () => {
					 currentSpan.setAttributes( attributes )

					 if ( prototype.constructor.name === 'AsyncFunction' )
						{
						  return prototype.apply( this, args )
						}

					 result = prototype.apply( this, args )
					 return result
				  } )
				}
			 catch ( error )
				{
				  CoreAutomaticTracer.recordException( error, currentSpan )
				}
			 finally
				{
				  currentSpan.end()
				}

			 return result
		  }

		  Reflect.defineMetadata( OPEN_TELEMETRY_TRACE_METADATA, traceName, method )
		  this.affect( method )
		  this.reDecorate( prototype, method )

		  return method
		}

	 protected affect(prototype : any)
		{
		  Reflect.defineMetadata( OPEN_TELEMETRY_TRACE_METADATA_ACTIVE, 1, prototype )
		}
  }