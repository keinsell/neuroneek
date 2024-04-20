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
export class ScheduleInjector
  extends CoreAutomaticTracer
  implements AutomaticTraceInjector
  {
	 private static SCHEDULE_CRON_OPTIONS     = 'SCHEDULE_CRON_OPTIONS'
	 private static SCHEDULE_INTERVAL_OPTIONS = 'SCHEDULE_INTERVAL_OPTIONS'
	 private static SCHEDULE_TIMEOUT_OPTIONS  = 'SCHEDULE_TIMEOUT_OPTIONS'
	 private static SCHEDULER_NAME            = 'SCHEDULER_NAME'

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
				const keys = this.metadataScanner.getAllFilteredMethodNames( provider.metatype.prototype )

				for ( const key of keys )
				  {
					 if ( !this.isDecorated( provider.metatype.prototype[ key ] ) && !this.isAffected(
						provider.metatype.prototype[ key ] ) && this.isScheduler( provider.metatype.prototype[ key ] ) )
						{
						  const name                         = this.getName( provider, provider.metatype.prototype[ key ] )
						  provider.metatype.prototype[ key ] = this.wrap( provider.metatype.prototype[ key ], name )
						  this.loggerService.log( `Mapped ${name}`, this.constructor.name )
						}
				  }
			 }
		}

	 private isScheduler(prototype : InstanceWrapper | Function) : boolean
		{
		  return ( this.isCron( prototype ) || this.isTimeout( prototype ) || this.isInterval( prototype ) )
		}

	 private isCron(prototype : InstanceWrapper | Function) : boolean
		{
		  return Reflect.hasMetadata( ScheduleInjector.SCHEDULE_CRON_OPTIONS, prototype )
		}

	 private isTimeout(prototype : InstanceWrapper | Function) : boolean
		{
		  return Reflect.hasMetadata( ScheduleInjector.SCHEDULE_TIMEOUT_OPTIONS, prototype )
		}

	 private isInterval(prototype : InstanceWrapper | Function) : boolean
		{
		  return Reflect.hasMetadata( ScheduleInjector.SCHEDULE_INTERVAL_OPTIONS, prototype )
		}

	 private getName(
		provider : InstanceWrapper,
		prototype : InstanceWrapper | Function,
	 ) : any
		{
		  if ( this.isCron( prototype ) )
			 {
				const options = Reflect.getMetadata( ScheduleInjector.SCHEDULE_CRON_OPTIONS, prototype )
				if ( options && options.name )
				  {
					 return `Scheduler->Cron->${provider.name}.${options.name}`
				  }
				return `Scheduler->Cron->${provider.name}.${prototype.name}`
			 }

		  if ( this.isTimeout( prototype ) )
			 {
				const name = Reflect.getMetadata( ScheduleInjector.SCHEDULER_NAME, prototype )
				if ( name )
				  {
					 return `Scheduler->Timeout->${provider.name}.${name}`
				  }
				return `Scheduler->Timeout->${provider.name}.${prototype.name}`
			 }

		  if ( this.isInterval( prototype ) )
			 {
				const name = Reflect.getMetadata( ScheduleInjector.SCHEDULER_NAME, prototype )
				if ( name )
				  {
					 return `Scheduler->Interval->${provider.name}.${name}`
				  }
				return `Scheduler->Interval->${provider.name}.${prototype.name}`
			 }
		}
  }