import {
  Inject,
  Injectable,
  Scope,
}                          from '@nestjs/common'
import { REQUEST }         from '@nestjs/core'
import { SpanKind }        from '@opentelemetry/api'
import { startSpan }       from '@sentry/opentelemetry'
import type { Span }       from '../../observability/tracing/opentelemetry/span.js'
import { TRACE_OPERATION } from '../../observability/tracing/value/trace-operation.js'



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

		  const transaction = startSpan( {
													  name       : `${method} ${url}`,
													  source     : 'url',
													  kind       : SpanKind.SERVER,
													  op         : TRACE_OPERATION.http.server,
													  attributes : {
														 method,
														 url, ...headersParsed,
														 http_method   : method,
														 'http.method' : method,
													  },
													}, (span : Span) => {
			 return span
		  } )
		}
  }