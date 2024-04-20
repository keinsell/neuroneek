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
}                                 from '@nestjs/common'
import { ModulesContainer }       from '@nestjs/core'
import type { InstanceWrapper }   from '@nestjs/core/injector/instance-wrapper.js'
import { AutomaticTraceInjector } from '../../contract/automatic-trace-injector/automatic-trace-injector.js'
import { CoreAutomaticTracer }    from './core-automatic-tracer.js'



@Injectable()
export class EventEmitterInjector
  extends CoreAutomaticTracer
  implements AutomaticTraceInjector
  {
	 private static EVENT_LISTENER_METADATA = 'EVENT_LISTENER_METADATA'

	 private readonly loggerService = new Logger()

	 constructor(protected readonly modulesContainer : ModulesContainer)
		{
		  super( modulesContainer )
		}

	 public async inject()
		{
		  const providers = this.getProviders()

		  for ( const provider of providers )
			 {
				const keys = this.metadataScanner.getAllMethodNames( provider.metatype.prototype )

				for ( const key of keys )
				  {
					 if ( !this.isDecorated( provider.metatype.prototype[ key ] ) && !this.isAffected(
						provider.metatype.prototype[ key ] ) && this.isEventConsumer( provider.metatype.prototype[ key ] ) )
						{
						  const eventName                    = this.getEventName( provider.metatype.prototype[ key ] )
						  provider.metatype.prototype[ key ] = this.wrap( provider.metatype.prototype[ key ],
																						  `Event->${provider.name}.${eventName}`, {
																							 instance : provider.name,
																							 method   : provider.metatype.prototype[ key ].name,
																							 event    : eventName,
																						  },
						  )
						  this.loggerService.log( `Mapped ${provider.name}.${key}`, this.constructor.name )
						}
				  }
			 }
		}

	 private isEventConsumer(prototype : InstanceWrapper) : boolean
		{
		  return Reflect.getMetadata( EventEmitterInjector.EVENT_LISTENER_METADATA, prototype )
		}

	 private getEventName(prototype : InstanceWrapper) : string
		{
		  const metadata : Array<{ event : string }> = Reflect.getMetadata( EventEmitterInjector.EVENT_LISTENER_METADATA,
																								  prototype,
		  )
		  return metadata[ 0 ].event
		}
  }