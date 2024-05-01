import {ValidationPipe}                         from '@nestjs/common';
import {HttpAdapterHost, NestFactory}           from '@nestjs/core';
import {ExpressAdapter, NestExpressApplication} from '@nestjs/platform-express';
import {apiReference}                           from '@scalar/nestjs-api-reference';
import cookieParser                             from 'cookie-parser';
import delay                                    from 'delay';
import express, {Express}                       from 'express';
import helmet                                   from 'helmet';
import ms                                       from 'ms';
import process                                  from 'node:process';
import requestIp                                from 'request-ip';
import {HttpExceptionFilter}                    from './common/filters/exception-filter/http-exception-filter.js';
import {__appConfig, __config}                  from './configs/global/__config.js';
import {isDevelopment}                          from './configs/helper/is-development.js';
import {StaticFeatureFlags}                     from './configs/static-feature-flags.js';
import {Container}                              from './container.js';
import {FingerprintMiddleware}                  from './core/middleware/fingerprint.js';
import {buildSwaggerDocumentation}              from './core/modules/documentation/swagger/swagger.js';
import {CombinedLogger}                         from "./core/modules/logger/logger"
import {LoggerNestjsProxy}                      from "./core/modules/logger/nestjs-logger-proxy.js"
import {portAllocator}                          from './utilities/network-utils/port-allocator.js';



export async function bootstrap(): Promise<NestExpressApplication> {
	const logger = new CombinedLogger()

	logger.debug(("Bootstrapping application..."));

	const __expressApp: Express = express();

	logger.debug(("Express application created"));

	// Bootstrap application
	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(Container, new ExpressAdapter(__expressApp), {
		autoFlushLogs: true,
		cors:          true,
		bodyParser:    true,
		rawBody:       true,
		preview:       false,
		bufferLogs:    true,
		abortOnError:  isDevelopment(),
		snapshot:      isDevelopment(),
		logger:        new LoggerNestjsProxy(),
	});

	logger.debug('Got httpAdapter');


	app.useGlobalPipes(new ValidationPipe());
	app.useBodyParser('json');
	app.use(helmet({contentSecurityPolicy: false}));
	app.use(requestIp.mw());
	app.use(cookieParser());
	app.use(new FingerprintMiddleware().use);



	app.use(helmet({contentSecurityPolicy: false}));
	// Build swagger documentation
	const apiSpec = await buildSwaggerDocumentation(app);

	app.use('/reference', apiReference({
		spec:        {
			content: apiSpec,
		},
		showSidebar: true,
		isEditable:  false,
		layout:      'modern',
		theme:       'default',
	}));

	// The error handler must be before any other error middleware and after all controllers
	app.useGlobalFilters(new HttpExceptionFilter(app.get(HttpAdapterHost)));

	// Enable graceful shutdown hooks
	app.enableShutdownHooks();

	const PORT = __config.get('PORT');

	// Listen on selected application port (with grace)
	let openPort = await portAllocator(PORT);

	if (openPort.wasReplaced) {
		logger.warn(`Application performed port availability check and ::${PORT} is not available, found a new shiny ::${openPort.port} instead. If you believe this is a mistake, please check your environment variables and processes that are running on your machine.`);
	} else {
		logger.debug(`Port availability check succeeded and requested ::${PORT} is available`);
	}

	let isApplicationListening = false;
	let retryDelay             = ms('5s');
	let retryCount             = 3;

	const PROTOCOL = __config.get('PROTOCOL');
	const HOST     = __config.get('HOST');
	const NODE_ENV = __config.get('NODE_ENV');

	const applicationUrl = `${PROTOCOL}://${HOST}:${openPort.port}`;

	while (!isApplicationListening) {
		try {
			await app.listen(openPort.port, async () => {
				logger.debug(`${'-'.repeat(54)}`);
				logger.debug(`🚀 Application started on ${applicationUrl} in ${NODE_ENV} mode`);

				logger.debug(`${'-'.repeat(54)}`);
				logger.debug(`📄 OpenAPI 3.0 Documentation: ${applicationUrl + '/reference'}`);
				if (StaticFeatureFlags.isGraphQLRunning) {
					logger.debug(`🧩 GraphQL is running on: ${applicationUrl + '/graphql'}`);
				}
				logger.debug(`🩺 Healthcheck endpoint: ${applicationUrl + __config.get('APPLICATION').HEALTHCHECK_ENDPOINT}`);

				if (isDevelopment() && StaticFeatureFlags.shouldRunPrismaStudio) {
					logger.debug(`🧩 Prisma Admin is running on: http://localhost:${__appConfig.PRISMA_ADMIN_PORT}`);
				}

				logger.debug(`${'-'.repeat(54)}`);
			});

			isApplicationListening = true;
		} catch (e) {
			logger.error(`Error while trying to start application: ${(
				e as unknown as any
			).message}`);
			await delay(retryDelay);
			openPort   = await portAllocator(PORT);
			retryDelay = retryDelay * 2;
		}

		if (retryCount === 0) {
			logger.error(`Application failed to start after ${retryCount} attempts`);
			process.exit(1);
		}

		retryCount--;
	}

	return app;
}
