import {
  Controller,
  Get,
}                            from '@nestjs/common'
import { ApiOperation }      from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorFunction,
  HealthIndicatorResult,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
}                            from '@nestjs/terminus'
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check/health-check-result.interface.js'
import { PrismaService }     from '../../resources/prisma/services/prisma-service.js'



/**
 * The HealthController class provides an API endpoint for checking the health status of the application
 *
 * @class
 * @controller
 * @param {HealthCheckService} health - The health check service used to check the health status of the application.
 * @param {MemoryHealthIndicator} memory - The memory health indicator used to check the memory usage of the service.
 * @param {PrismaHealthIndicator} prisma - The Prisma health indicator used to check the health status of the Prisma
 *     service.
 * @param {PrismaService} prismaService - The Prisma service used to interact with the database.
 */

@Controller( 'health' )
export class HealthController
  {
	 constructor(
		private health : HealthCheckService,
		private memory : MemoryHealthIndicator,
		private prisma : PrismaHealthIndicator,
		private prismaService : PrismaService,
	 )
		{
		}


	 /**
	  * Checks the health status of the application.
	  *
	  * @returns {Promise<HealthCheckResult>} - A promise that resolves to an array of health indicator results.
	  */
	 @ApiOperation( {
							summary     : 'Health check endpoint',
							operationId : 'healthcheck',
						 } ) @Get() @HealthCheck() check() : Promise<HealthCheckResult>
		{
		  const healthIndicators : HealthIndicatorFunction[] = []

		  healthIndicators.push( this.checkMemory.bind( this ) )
		  healthIndicators.push( this.checkPrisma.bind( this ) )

		  return this.health.check( [
												...healthIndicators,
											 ] )
		}


	 /**
	  * Checks the memory usage of the service.
	  * The service should not use more than 150MB of memory.
	  *
	  * @returns {boolean} - Returns true if the memory usage is within the specified limit, otherwise false.
	  */
	 private checkMemory() : Promise<HealthIndicatorResult>
		{
		  // Service should not use more than 150MB memory
		  return this.memory.checkHeap( 'memory_heap', 150 * 1024 * 1024 )
		}


	 /**
	  * The checkPrisma function is a helper function that checks to see if the Prisma service is up and running.
	  * It does this by pinging the database with a simple query, which returns an object containing information about
	  * the database. If it receives this object, then it knows that everything is working properly. Otherwise, it
	  * will throw an error.
	  *
	  * @returns {Promise<HealthIndicatorResult>} - A promise that resolves to an object containing information about
	  *     the health status of the Prisma service.
	  */
	 private checkPrisma() : Promise<HealthIndicatorResult>
		{
		  // Prisma should be able to ping database
		  return this.prisma.pingCheck( 'prisma', this.prismaService )
		}


	 private checkRedis()
		{
		  // Service should be able to ping redis
		}
  }
