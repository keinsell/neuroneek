import {
	HttpException,
	Logger,
	ValidationPipe,
}                                      from '@nestjs/common'
import {
	HttpAdapterHost,
	NestFactory,
}                                      from '@nestjs/core'
import {
	ExpressAdapter,
	NestExpressApplication,
}                                      from '@nestjs/platform-express'
import {apiReference}                  from '@scalar/nestjs-api-reference'
import Sentry                          from '@sentry/node'
import cookieParser                    from 'cookie-parser'
import delay                           from 'delay'
import express, {
	Express,
	NextFunction,
}                                      from 'express'
import helmet                          from 'helmet'
import ms                              from 'ms'
import process                         from 'node:process'
import requestIp                       from 'request-ip'
import {startTunnel}                   from 'untun'
import {HttpExceptionFilter}           from './common/filters/exception-filter/http-exception-filter.js'
import {HttpStatus}                    from './common/http-status.js'
import {buildCompodocDocumentation}    from './common/modules/documentation/compodoc/compodoc.js'
import {buildSwaggerDocumentation}     from './common/modules/documentation/swagger/swagger.js'
import {executePrismaRelatedProcesses} from './common/modules/resources/prisma/utils/execute-prisma-related-processes.js'
import {
	__appConfig,
	__config,
}                                      from './configs/global/__config.js'
import {isDevelopment}                 from './configs/helper/is-development.js'
import {StaticFeatureFlags}            from './configs/static-feature-flags.js'
import {Container}                     from './container.js'
import {migrateDatabase}               from './hooks/post-start/migrate-database.js'
import {LoggerNestjsProxy}             from './kernel/modules/logger/nestjs-logger-proxy.js'
import {FingerprintMiddleware}         from './kernel/platform/http/middleware/fingerprint.js'
import {
	ExpressRequest,
	ExpressResponse,
}                                      from './types/express-response.js'
import {portAllocator}                 from './utilities/network-utils/port-allocator.js'



export async function bootstrap(): Promise<NestExpressApplication>
{
	const __expressApp: Express = express()

	// Bootstrap application
	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(Container, new ExpressAdapter(__expressApp), {
		autoFlushLogs: true,
		cors         : true,
		bodyParser   : true,
		rawBody      : true,
		preview      : false,
		bufferLogs   : true,
		abortOnError : isDevelopment(),
		snapshot     : isDevelopment(),
		logger       : new LoggerNestjsProxy(),
	})

	const {httpAdapter} = app.get(HttpAdapterHost)

	app.useGlobalPipes(new ValidationPipe())
	app.useBodyParser('json')
	app.use(helmet({contentSecurityPolicy: false}))
	app.use(requestIp.mw())
	app.use(cookieParser())
	app.use(new FingerprintMiddleware().use)

	// Implement logger used for bootstrapping and notifying about application state
	const logger = new Logger('Bootstrap')

	await executePrismaRelatedProcesses()

	app.use(helmet({contentSecurityPolicy: false}))
	// Build swagger documentation
	const apiSpec = await buildSwaggerDocumentation(app)

	app.use('/reference', apiReference({
		                                   spec       : {
			                                   content: apiSpec,
		                                   },
		                                   showSidebar: true,
		                                   isEditable : false,
		                                   layout     : 'modern',
		                                   theme      : 'kepler',
	                                   }))


	buildCompodocDocumentation()

	// The error handler must be before any other error middleware and after all controllers
	app.useGlobalFilters(new HttpExceptionFilter(app.get(HttpAdapterHost)))

	app.use(Sentry.Handlers.errorHandler({
		                                     // No better idea how to filter out non-important errors rn
		                                     shouldHandleError: function (error: Error | HttpException): boolean
		                                     {
			                                     if (error instanceof HttpException)
			                                     {
				                                     return error.getStatus() >= HttpStatus.INTERNAL_SERVER_ERROR
			                                     }
			                                     return true
		                                     },
	                                     }))


	// Optional fallthrough error handler
	app.use(function onError(_err: Error, _req: ExpressRequest, res: ExpressResponse, _next: NextFunction)
	        {
		        res.statusCode = 500
		        res.end((
			                res as any
		                ).sentry + '\n')
	        })

	// Enable graceful shutdown hooks
	app.enableShutdownHooks()

	const PORT = __config.get('PORT')

	// Listen on selected application port (with grace)
	let openPort = await portAllocator(PORT)

	if (openPort.wasReplaced)
	{
		logger.warn(`Application performed port availability check and ::${PORT} is not available, found a new shiny ::${openPort.port} instead. If you believe this is a mistake, please check your environment variables and processes that are running on your machine.`)
	}
	else
	{
		logger.log(`Port availability check succeeded and requested ::${PORT} is available`)
	}

	let isApplicationListening = false
	let retryDelay             = ms('5s')
	let retryCount             = 3

	const PROTOCOL = __config.get('PROTOCOL')
	const HOST     = __config.get('HOST')
	const NODE_ENV = __config.get('NODE_ENV')

	const applicationUrl = `${PROTOCOL}://${HOST}:${openPort.port}`

	while (!isApplicationListening)
	{
		try
		{
			await app.listen(openPort.port, async () =>
			{
				logger.verbose(`${'-'.repeat(54)}`)
				logger.log(`🚀 Application started on ${applicationUrl} in ${NODE_ENV} mode`)

				logger.verbose(`${'-'.repeat(54)}`)
				logger.verbose(`📄 Compodoc endpoint: ${applicationUrl + '/docs'}`)
				logger.verbose(`📄 OpenAPI 3.0 Documentation: ${applicationUrl + '/reference'}`)
				if (StaticFeatureFlags.isGraphQLRunning)
				{
					logger.verbose(`🧩 GraphQL is running on: ${applicationUrl + '/graphql'}`)
				}
				logger.verbose(`🩺 Healthcheck endpoint: ${applicationUrl
				                                          + __config.get('APPLICATION').HEALTHCHECK_ENDPOINT}`)

				if (isDevelopment() && StaticFeatureFlags.shouldRunPrismaStudio)
				{
					logger.verbose(`🧩 Prisma Admin is running on: http://localhost:${__appConfig.PRISMA_ADMIN_PORT}`)
				}

				logger.verbose(`${'-'.repeat(54)}`)

				if (__config.get('FEATURE').ENABLE_TUNNEL)
				{
					const tunnel = await startTunnel({
						                                 port                  : openPort.port,
						                                 acceptCloudflareNotice: true,
					                                 })

					if (tunnel)
					{
						logger.log(`🚇 Tunnel is enabled, you can access your application via public URL: ${await tunnel.getURL()}`)
					}
				}

			})
			isApplicationListening = true
		}
		catch (e)
		{
			logger.error(`Error while trying to start application: ${(
				e as unknown as any
			).message}`)
			await delay(retryDelay)
			openPort   = await portAllocator(PORT)
			retryDelay = retryDelay * 2
		}

		if (retryCount === 0)
		{
			logger.error(`Application failed to start after ${retryCount} attempts`)
			process.exit(1)
		}

		retryCount--
	}

	await migrateDatabase()

	return app
}
