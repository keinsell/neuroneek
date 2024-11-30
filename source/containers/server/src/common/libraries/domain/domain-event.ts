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


import { Event }       from '../message/event.js'
import { MessageType } from '../message/values/message-type.js'
import { EntityBase }  from './entity/entity-base.js'



type ValueProperties<T> = Omit<T, {
  [K in keyof T] : T[K] extends Function ? K : never
}[keyof T]>


/** Domain Event is a type of message (event) that is happening from a specific aggregate, the aim of this abstraction is to provide simplified way of handling domain events. */
export abstract class DomainEvent<T extends EntityBase<unknown>>
  extends Event<{
						aggregateId : T['id'], aggregateVersion : T['version']
					 } & ValueProperties<T>>
  {
	 public constructor(
		aggregateOrEntity : T,
		namespace? : string | undefined,
	 )
		{
		  super( {
					  body      : {
						 ...DomainEvent.processAggregate( aggregateOrEntity ),
						 aggregateId      : aggregateOrEntity.id,
						 aggregateVersion : aggregateOrEntity.version,
					  },
					  type      : MessageType.EVENT,
					  namespace : namespace,
					} )
		}

	 static processAggregate<T extends EntityBase<any>>(body : T) : ValueProperties<T>
		{
		  // Remove all functions and prepare just data from class
		  const data = Object.assign( {}, body )

		  // Remove all functions
		  for ( const key in data )
			 {
				if ( typeof data[ key ] === typeof Function )
				  {
					 delete data[ key ]
				  }

				const keysToRemove : string[] = [ '_events', 'logger' ]

				if ( keysToRemove.includes( key ) )
				  {
					 delete data[ key ]
				  }
			 }

		  return data
		}
  }