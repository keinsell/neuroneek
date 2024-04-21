import {Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit, Optional} from '@nestjs/common'
import Sentry                                                                from '@sentry/node'
import {getActiveSpan}                                                       from '@sentry/opentelemetry'
import {Prisma, PrismaClient}                                                from 'db'
import delay                                                                 from 'delay'
import ms                                                                    from 'ms'
import {isProduction}                                                        from '../../../../../configs/helper/is-production.js'
import {ApplicationState}                                                    from '../../../../state.js'
import {__sentryClient}                                                      from '../../sentry-v2/global/get-sentry.js'
import {PRISMA_SERVICE_OPTIONS}                                              from '../constants/PRISMA_SERVICE_OPTIONS.js'
import {PrismaServiceOptions}                                                from '../structures/prisma-service-options.js'



@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'info' | 'warn' | 'error'>
	implements OnModuleInit, OnModuleDestroy {
	private logger: Logger = new Logger('prisma')


	constructor(@Optional() @Inject(PRISMA_SERVICE_OPTIONS) private readonly prismaServiceOptions: PrismaServiceOptions = {}) {
		super({
			...prismaServiceOptions.prismaOptions,
			log:           [
				{
					emit:  'event',
					level: 'query',
				},
			],
			errorFormat:   'minimal',
			datasourceUrl: process.env.DATABASE_URI,
		})

		if (this.prismaServiceOptions.middlewares) {
			this.prismaServiceOptions.middlewares.forEach((middleware) => this.$use(middleware))
		}

		// Integrate with Sentry
		if (__sentryClient) {
			this.logger.verbose(`Sentry is enabled, Prisma will send events to Sentry.`)

			new Sentry.Integrations.Prisma({
				client: this,
			}).setupOnce()
		}
	}


	async onModuleInit() {
		// Enable custom logger for Prisma
		this.setupLogging()

		// Use an immediately invoked asynchronous function
		// to handle the connection in the background.
		//noinspection ES6MissingAwait
		this.startConnection()

		if (this.prismaServiceOptions.explicitConnect) {
			await this.$connect()
		}
	}


	async onModuleDestroy() {
		this.logger.debug('Closing prisma connection...')
		await this.$disconnect()
		.then(() => {
			ApplicationState.isDatabaseConnected = false
			this.logger.log('Prisma connection was closed successfully.')
		})
	}


	private async startConnection() {
		ApplicationState.isDatabaseConnected = false
		let connectionRetryDelay             = ms('5s')

		// Handle retries to the database without blocking
		while (!ApplicationState.isDatabaseConnected) {
			try {
				await this.$connect()
				this.logger.log('Connection with a database established.')
				ApplicationState.isDatabaseConnected = true
			} catch (error) {
				this.logger.error(`Server failed to connect to database, retrying in ${ms(connectionRetryDelay)}...`)
				this.logger.error(`${JSON.stringify(error)}`)
				getActiveSpan()
				?.recordException(error)

				await delay(connectionRetryDelay)
				connectionRetryDelay = connectionRetryDelay * 2

				if (isProduction()) {
					Sentry.captureException(error)
				}
			}
		}
	}


	// TODO: Improve Prisma Logging (https://www.npmjs.com/package/prisma-query-log)
	// TODO: https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging
	private setupLogging() {
		this.$on('error', (event) => {
			this.logger.error(event.message)
		})
		this.$on('warn', (event) => {
			this.logger.warn(event.message)
		})
		this.$on('info', (event) => {
			this.logger.verbose(event.message)
		})
		this.$on('query', (event) => {
			this.logger.verbose(event.query)
		})
	}
}