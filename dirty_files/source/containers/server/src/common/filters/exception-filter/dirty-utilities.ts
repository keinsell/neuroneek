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

import { ValidationError } from 'class-validator'
import { snake }           from 'typia/lib/notations.js'



/**
 *
 * Extract the stringified error code
 *
 * @param exResponse - exception response
 * @returns - string that describes the error
 */
export function getCode(exResponse : ExceptionResponse | string) : string
  {
	 if ( typeof exResponse === 'string' )
		{
		  return formatErrorCode( exResponse )
		}

	 if ( 'error' in exResponse && typeof exResponse.error === 'string' )
		{
		  return formatErrorCode( exResponse.error )
		}

	 if ( 'code' in exResponse && typeof exResponse.code === 'string' )
		{
		  return exResponse.code
		}

	 return ''
  }

/*
 Extract the error messages
 */
export function getErrorMessage(exResponse : ExceptionResponse | string) : string
  {
	 if ( typeof exResponse === 'string' )
		{
		  return exResponse
		}

	 if ( typeof exResponse.message === 'string' )
		{
		  return exResponse.message
		}

	 if ( Array.isArray( exResponse.message ) )
		{
		  // process the first error message
		  const error : ValidationError | string = exResponse.message[ 0 ]
		  if ( typeof error === 'string' )
			 {
				return error
			 }
		  const validationError : string = parseErrorMessage( error )
		  if ( validationError )
			 {
				return validationError
			 }
		}

	 return 'INTERNAL_SERVER_ERROR'
  }

/**
 * Format a string to uppercase and snakeCase
 *
 * @param error - string
 * @returns - ex `Bad Request` become `BAD_REQUEST`
 */
function formatErrorCode(error : string) : string
  {
	 return ( snake( error ) ).toUpperCase()
  }

/*
 Aggregation of error messages for a given ValidationError
 */
function parseErrorMessage(error : ValidationError) : string
  {
	 let message : string                    = ''
	 const messages : Constraint | undefined = findConstraints( error )

	 if ( messages === undefined )
		{
		  return 'Invalid parameter'
		}

	 Object.keys( messages ).forEach( (key : string) : void => {
		message += `${message === '' ? '' : ' -- '}${messages[ key ]}`
	 } )

	 return message
  }

/**
 * Find contraints in an error oject
 */
function findConstraints(error : ValidationError) : Constraint | undefined
  {
	 let objectToIterate : ValidationError = error
	 while ( objectToIterate.children !== undefined )
		{
		  objectToIterate = objectToIterate.children[ 0 ]
		}

	 return objectToIterate.constraints
  }


/**
 * Contraints of the validation
 */
interface Constraint
  {
	 [ type : string ] : string;
  }


/**
 * Exception response
 */
interface ExceptionResponse
  {
	 code? : string;
	 error? : string;
	 message? : string | string[] | ValidationError[];
  }


export function getObjectValue(
  obj : any,
  ...ref : string[]
) : any
  {
	 if ( !obj || !ref || !ref.length )
		{
		  return undefined
		}

	 if ( ref.length === 1 )
		{
		  return obj[ ref[ 0 ] ]
		}

	 return getObjectValue( obj[ ref[ 0 ] ], ...ref.slice( 1 ) )
  }
