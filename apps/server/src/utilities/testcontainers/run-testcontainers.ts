import {$}               from 'execa'
import process           from 'node:process'
import {Readable}        from 'stream'
import {
	GenericContainer,
	type StartedTestContainer,
}                        from 'testcontainers'
import {LogWaitStrategy} from 'testcontainers/build/wait-strategies/log-wait-strategy.js'
import {__appConfig}     from '../../configs/global/__config.js'
import {CombinedLogger}  from '../../kernel/modules/logger/logger.js'



const postgres = new GenericContainer('postgres:latest')
	.withEnvironment({
		                 POSTGRES_USER    : 'test_user',
		                 POSTGRES_PASSWORD: 'test_password',
		                 POSTGRES_DB      : 'test_db',
	                 })
	.withExposedPorts(5432)
	.withLogConsumer((stream: Readable) =>
	                 {
		                 const logger = new CombinedLogger('container::postgresql')
		                 stream.on('data', (data) =>
		                 {
			                 const logLine = data.toString().trim()
			                 if (logLine)
			                 {
				                 logger.debug(logLine)
			                 }
		                 })
	                 })
	.withWaitStrategy(new LogWaitStrategy('database system is ready to accept connections', 2))

const redis = new GenericContainer('redis:latest')
	.withExposedPorts(6379)
	.withLogConsumer((stream: Readable) =>
	                 {
		                 const logger = new CombinedLogger('container::redis')
		                 stream.on('data', (data) =>
		                 {
			                 const logLine = data.toString().trim()
			                 if (logLine)
			                 {
				                 logger.debug(logLine)
			                 }
		                 })
	                 })
	.withWaitStrategy(new LogWaitStrategy('Ready to accept connections', 2))

export var __RUNNING_CONTAINER: StartedTestContainer[] = []


export class ContainerEnvironment
{
	private containers: {
		name: string,
		container: GenericContainer
	}[] = []


	constructor()
	{
		this.containers.push({
			                     name     : 'postgres',
			                     container: postgres,
		                     })
	}


	static async run()
	{
		if (__appConfig.FEATURE_USE_DOCKER_TESTCONTAINERS)
		{
			new CombinedLogger('environment').debug('Application is running in'
			                                        + ' \'testing\' environment'
			                                        + ' which means there will'
			                                        + ' be mocked up'
			                                        + ' dependencies such as'
			                                        + ' databases. Please a'
			                                        + ' wait a longer while to'
			                                        + ' let application setup'
			                                        + ' everything.')

			await new ContainerEnvironment().startContainers()
		}
	}


	private async startContainers()
	{
		for await (const container of this.containers)
		{
			const runningContainer = await container.container.start()
			const logger           = new CombinedLogger('testcontainer')
			logger.info(`Started ${container.name}`)

			if (container.name === 'postgres')
			{
				// Get container information
				const host = runningContainer.getHost()
				const port = runningContainer.getMappedPort(5432)

				// Set the database URI in the environment variable
				const dbUri = `postgresql://test_user:test_password@${host}:${port}/test_db`
				logger.info(`Postgres container is available at: ${dbUri}`)
				process.env.DATABASE_URI = dbUri

				new CombinedLogger('prisma::cli').debug('Pushing database schema with prisma')
				await $`prisma db push --skip-generate`
				new CombinedLogger('prisma::cli').info('Completed database migration')
			}

			__RUNNING_CONTAINER.push(runningContainer)
		}
	}
}


export async function prepareContainerizedDevelopmentEnvironment()
{
	// We definitely do not want to use test/dev things on production
	if (process.env.NODE_ENV === 'production')
	{
		return
	}

	// Check if we are running in a CI environment
	if (process.env.CI)
	{
		return
	}

	// Check if HOST is running Docker that we can use
	try
	{
		await $`docker info`
	}
	catch (e)
	{
		new CombinedLogger('environment').warn('Docker is not running on your machine. Skipping containerized development environment setup.')
		return
	}

	// Check if Database URI is provided in the environment
	await ContainerEnvironment.run()
}
