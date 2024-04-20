// Controller that is intented to take few good seconds to return request to test functionality of cache.

import {
	Controller,
	Get,
	Logger,
}                     from '@nestjs/common'
import {ApiOperation} from '@nestjs/swagger'
import * as crypto    from 'crypto'



@Controller('compute')
export class ComputeController
{
	private logger: Logger = new Logger('shitcompute:controller')

	@ApiOperation({
		              description: 'Compute the shit',
	              }) @Get()
	private compute(): any
	{
		let i            = 0
		const shittyData = []

		this.logger.debug('Generating shittons of data...')

		while (i < 100_000)
		{
			this.logger.debug(`Generating shittons of data... ${i}/100_000`)
			shittyData.push(crypto.randomBytes(32).toString())
			i++
		}

		return shittyData
	}



	@ApiOperation({
		              description: 'Compute the shit2',
	              }) @Get('v2')
	private async computeV2(): Promise<any>
	{
		this.logger.debug('Generating shittons of data...')

		let i       = 0
		const task  = async () => await crypto.randomBytes(32).toString()
		const tasks = []

		while (i < 100_000)
		{
			tasks.push(task)
			i++
		}

		return await Promise.all(tasks)
	}

}
