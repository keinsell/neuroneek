import {Inject, Injectable, Scope} from '@nestjs/common'
import {REQUEST}                    from '@nestjs/core'



@Injectable( {scope : Scope.REQUEST} )
export class SentryService
  {
	 constructor(@Inject( REQUEST ) private request : Request)
		{

		  const {
					 method,
					 headers,
					 url,
				  } = this.request

		  const headersParsed : Record<string, any> = {}

		  headers.forEach( (
									value,
									key,
								 ) => {
			 headersParsed[ key ] = value
		  } )
		}
  }