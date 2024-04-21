//export function prismaLoggingMiddleware(args : LoggingMiddlewareOptions = {
//  logger   : console,
//  logLevel : 'debug',
//}) : Prisma.Middleware
//  {
//	 return async (
//		params,
//		next,
//	 ) => {
//		const before = Date.now()
//		const result = await next( params )
//		const after  = Date.now()
//
//		const executionTime = after - before
//
//		const nestLogger = new Logger( 'prisma' )
//
//		nestLogger.verbose( `Prisma query: ${params.model}.${params.action}() in ${executionTime}ms` )
//
//		return result
//	 }
//  }