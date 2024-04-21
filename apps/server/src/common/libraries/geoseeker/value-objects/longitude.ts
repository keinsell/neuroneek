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

import t               from 'typia'
import typia, { tags } from 'typia'
import {
  Opaque,
  UnwrapOpaque,
}                      from '../../opaque.js'



export type Longitude = Opaque<number & t.tags.Maximum<180> & t.tags.Minimum<-180> & tags.Type<'float'>, 'longitude'>

const validateLongitude = typia.createValidate<UnwrapOpaque<Longitude>>()

export function createLongitude(longitude : unknown) : Longitude
  {
	 const validation = validateLongitude( longitude )

	 const messages : string[] = []

	 if ( validation.errors.length > 0 )
		{
		  for ( const error of validation.errors )
			 {
				const errorMessage = `Received input at ${error.path}, provided value: ${error.value}, expected: ${error.expected}`
				messages.push( errorMessage )
			 }

		  throw new Error( messages.join( '\n' ) )
		}
	 else
		{
		  return longitude as Longitude
		}
  }

