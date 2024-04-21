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
import { AutomaticTraceInjector } from '../../contract/automatic-trace-injector/automatic-trace-injector.js'
import { CoreAutomaticTracer }    from './core-automatic-tracer.js'



@Injectable()
export class ControllerInjector
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
					 if ( !this.isDecorated( controller.metatype.prototype[ key ] ) && !this.isAffected(
						controller.metatype.prototype[ key ] ) && this.isPath( controller.metatype.prototype[ key ] ) )
						{
						  const traceName = `controller - ${controller.name.toLowerCase()}.${controller.metatype.prototype[ key ].name.toLowerCase()}`

						  const method = this.wrap( controller.metatype.prototype[ key ], traceName, {
							 controller : controller.name,
							 method     : controller.metatype.prototype[ key ].name,
						  } )

						  this.reDecorate( controller.metatype.prototype[ key ], method )

						  controller.metatype.prototype[ key ] = method
						  this.loggerService.verbose( `Mapped Controller: ${controller.name}.${key}`, this.constructor.name )
						}
				  }
			 }
		}
  }