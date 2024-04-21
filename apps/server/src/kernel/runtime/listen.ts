import {NestExpressApplication} from '@nestjs/platform-express'
import {NestFastifyApplication} from '@nestjs/platform-fastify'



/** Function will start listening to the provided application */
export async function listen(app: NestExpressApplication | NestFastifyApplication): Promise<void>
{
	await app.listen(3000)
}
