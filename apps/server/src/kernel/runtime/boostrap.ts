import {NestFactory}       from '@nestjs/core'
import {
	ExpressAdapter,
	NestExpressApplication,
}                          from '@nestjs/platform-express'
import express, {Express}  from 'express'
import helmet              from 'helmet'
import {isDevelopment}     from '../../configs/helper/is-development.js'
import {Container}         from '../../container.js'
import {LoggerNestjsProxy} from '../modules/logger/nestjs-logger-proxy.js'



export interface IBootstrap
{
	(): Promise<NestExpressApplication>
}


export async function createExpressApplication(): Promise<NestExpressApplication>
{
	const expressHttpServer: Express = express()

	const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(Container, new ExpressAdapter(expressHttpServer), {
		autoFlushLogs: true, //cors:          true,
		//bodyParser:    true,
		//rawBody:       true,
		preview     : false,
		bufferLogs  : true,
		abortOnError: isDevelopment(),
		snapshot    : isDevelopment(),
		logger      : new LoggerNestjsProxy(),
	})

	app.useBodyParser('json')
	app.use(helmet({contentSecurityPolicy: false}))

	// Enable graceful shutdown hooks
	// This is useful for not losing any data when the application is shutting down
	app.enableShutdownHooks()

	return app
}


