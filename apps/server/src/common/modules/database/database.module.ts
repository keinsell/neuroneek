import {Module}                  from '@nestjs/common'
import {prismaTracingMiddleware} from '../resources/prisma/middleware/prisma-tracing-middleware.js'
import {PrismaModule}            from '../resources/prisma/prisma-module.js'



@Module({
	imports:     [
		PrismaModule.forRoot({
			prismaServiceOptions: {
				middlewares: [prismaTracingMiddleware()],
			},
		}),
	],
	controllers: [],
	providers:   [],
	exports:     [PrismaModule],
})
export class DatabaseModule {
}