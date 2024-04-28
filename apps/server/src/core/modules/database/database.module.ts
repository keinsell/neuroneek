import {Module}                  from '@nestjs/common'
import {prismaTracingMiddleware} from "./prisma/middleware/prisma-tracing-middleware.js"
import {PrismaModule}            from "./prisma/prisma-module.js"



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