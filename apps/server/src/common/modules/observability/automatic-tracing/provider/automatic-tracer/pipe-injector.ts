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

import {
  Injectable,
  Logger,
  PipeTransform,
}                                 from '@nestjs/common'
import { PIPES_METADATA }         from '@nestjs/common/constants.js'
import {
  APP_PIPE,
  ModulesContainer,
}                                 from '@nestjs/core'
import { InstanceWrapper }        from '@nestjs/core/injector/instance-wrapper.js'
import { AutomaticTraceInjector } from '../../contract/automatic-trace-injector/automatic-trace-injector.js'
import { CoreAutomaticTracer }    from './core-automatic-tracer.js'



type TracePayload = {
  controller : string; method : string; pipe : string; scope : string;
};


interface LoggablePipeTransform
  extends PipeTransform
  {
	 transform : (
		arg : any,
		...args : any[]
	 ) => any;
	 constructor : new (...args : any[]) => PipeTransform;
  }


interface LoggableInstanceWrapper
  {
	 name : string;
  }



@Injectable()
export class PipeInjector
  extends CoreAutomaticTracer
  implements AutomaticTraceInjector
  {
	 private readonly loggerService = new Logger()

	 constructor(protected readonly modulesContainer : ModulesContainer)
		{
		  super( modulesContainer )
		}

	 public async inject()
		{
		  const controllers = this.getControllers()

		  for ( const controller of controllers )
			 {
				const keys = this.metadataScanner.getAllFilteredMethodNames( controller.metatype.prototype )

				for ( const key of keys )
				  {
					 if ( this.isPath( controller.metatype.prototype[ key ] ) )
						{
						  const pipes = this.getPipes( controller.metatype.prototype[ key ] ).map(
							 (pipe) => this.wrapPipe( pipe, controller, controller.metatype.prototype[ key ] ) )

						  if ( pipes.length > 0 )
							 {
								Reflect.defineMetadata( PIPES_METADATA, pipes, controller.metatype.prototype[ key ] )
							 }
						}
				  }
			 }

		  this.injectGlobals()
		}

	 private injectGlobals()
		{
		  const providers = this.getProviders()

		  for ( const provider of providers )
			 {
				if ( typeof provider.token === 'string' && provider.token.includes( APP_PIPE ) && !this.isAffected(
				  provider.metatype.prototype.transform ) )
				  {
					 const traceName                       = `Pipe->Global->${provider.metatype.name}`
					 provider.metatype.prototype.transform = this.wrap( provider.metatype.prototype.transform, traceName, {
						pipe  : provider.metatype.name,
						scope : 'GLOBAL',
					 } )
					 this.loggerService.log( `Mapped ${traceName}`, this.constructor.name )
				  }
			 }
		}

	 private wrapPipe(
		pipe : PipeTransform,
		controller : LoggableInstanceWrapper,
		prototype : Function | LoggableInstanceWrapper,
	 ) : PipeTransform
		{
		  const pipeProto = this.safePipeTransform( pipe )
		  if ( this.isAffected( pipeProto.transform ) ) return pipe

		  const traceName = `Pipe->${controller.name}.${prototype.name}.${pipeProto.constructor.name}`

		  pipeProto.transform = this.wrap( pipeProto.transform, traceName, {
			 controller : controller.name,
			 method     : prototype.name,
			 pipe       : pipeProto.constructor.name,
			 scope      : 'METHOD',
		  } )

		  this.loggerService.log( `Mapped ${traceName}`, this.constructor.name )

		  return pipeProto
		}

	 private getPipes(prototype : InstanceWrapper | Function) : PipeTransform[]
		{
		  return Reflect.getMetadata( PIPES_METADATA, prototype ) || []
		}

	 // Safely cast a PipeTransform to a concrete and mutable PipeTransform
	 private safePipeTransform(pipe : PipeTransform) : LoggablePipeTransform
		{
		  if ( 'transform' in pipe )
			 {
				return pipe as LoggablePipeTransform
			 }
		  else if ( 'prototype' in pipe && 'transform' in pipe[ 'prototype' ] )
			 {
				return pipe[ 'prototype' ] as LoggablePipeTransform
			 }

		  throw new Error( 'Provided pipe doesn\'t have a transform function.' )
		}
  }