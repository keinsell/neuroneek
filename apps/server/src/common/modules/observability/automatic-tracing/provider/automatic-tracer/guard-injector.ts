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
  CanActivate,
  Injectable,
  Logger,
}                                 from '@nestjs/common'
import { GUARDS_METADATA }        from '@nestjs/common/constants.js'
import {
  APP_GUARD,
  ModulesContainer,
}                                 from '@nestjs/core'
import type { InstanceWrapper }   from '@nestjs/core/injector/instance-wrapper.js'
import { AutomaticTraceInjector } from '../../contract/automatic-trace-injector/automatic-trace-injector.js'
import { CoreAutomaticTracer }    from './core-automatic-tracer.js'



interface ControllerInstance
  {
	 metatype : {
		// Any other properties that may exist on `metatype`
		prototype : Record<string, any>;
	 },
	 name : string;
  }


interface GuardInstance
  {
	 prototype : {
		canActivate : Function; // Any other properties that may exist on `prototype`
		constructor : Function;
	 };
  }


interface TracePayload
  {
	 controller : string;
	 guard : string;
	 scope : string;
	 method? : string;
  }


@Injectable()
export class GuardInjector
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
				const controllerPrototype = controller.metatype.prototype
				this.injectGuardsOnController( controller )

				const guardedMethods = Object.keys( controllerPrototype )
													  .filter( key => this.isGuarded( controllerPrototype[ key ] ) )

				for ( const method of guardedMethods )
				  {
					 this.injectGuardsOnMethod( controller, method )
				  }
			 }

		  this.injectGlobals()
		}

	 private injectGuardsOnController(controller : InstanceWrapper) : void
		{
		  if ( this.isGuarded( controller.metatype ) )
			 {
				const guards = this.createTraceableGuards( controller, controller.metatype, 'CONTROLLER' )
				Reflect.defineMetadata( GUARDS_METADATA, guards, controller.metatype )
			 }
		}

	 private injectGuardsOnMethod(
		controller : ControllerInstance,
		method : string,
	 ) : void
		{
		  const methodDef = controller.metatype.prototype[ method ]

		  if ( this.isGuarded( methodDef ) )
			 {
				const guards = this.createTraceableGuards( controller, methodDef, 'CONTROLLER_METHOD', method )
				Reflect.defineMetadata( GUARDS_METADATA, guards, methodDef )
			 }
		}

	 private createTraceableGuards(
		controller : ControllerInstance,
		guardedTarget : Function | InstanceWrapper,
		scope : string,
		method? : string,
	 ) : GuardInstance[]
		{
		  return this.getGuards( guardedTarget ).map( (guardInstance : any) => {
			 const {prototype} = guardInstance
			 const traceName   = `Guard->${controller.name}.${( method ? `${method}.` : '' )}${prototype.constructor.name}`

			 prototype.canActivate = this.wrap( prototype.canActivate, traceName, {
				controller : controller.name,
				guard      : prototype.constructor.name,
				scope,
				method,
			 } )

			 Object.assign( prototype, this )
			 this.loggerService.log( `Mapped ${traceName}`, this.constructor.name )

			 return guardInstance
		  } )
		}

	 private injectGlobals()
		{
		  const providers = this.getProviders()

		  for ( const provider of providers )
			 {
				if ( typeof provider.token === 'string' && provider.token.includes( APP_GUARD ) && !this.isAffected(
				  provider.metatype.prototype.canActivate ) )
				  {
					 const traceName                         = `Guard->Global->${provider.metatype.name}`
					 provider.metatype.prototype.canActivate = this.wrap( provider.metatype.prototype.canActivate, traceName,
																							{
																							  guard : provider.metatype.name,
																							  scope : 'GLOBAL',
																							},
					 )
					 Object.assign( provider.metatype.prototype, this )
					 this.loggerService.log( `Mapped ${traceName}`, this.constructor.name )
				  }
			 }
		}

	 private getGuards(prototype : InstanceWrapper | Function) : CanActivate[]
		{
		  return Reflect.getMetadata( GUARDS_METADATA, prototype ) || []
		}

	 private isGuarded(prototype : InstanceWrapper | Function) : boolean
		{
		  return Reflect.hasMetadata( GUARDS_METADATA, prototype )
		}
  }