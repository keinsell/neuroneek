import {Module}                 from "@nestjs/common"
import {CombinedLogger, Logger} from "./logger.js"
import {LoggerNestjsProxy}      from "./nestjs-logger-proxy.js"



@Module({
	providers: [
		{
			provide:  Logger,
			useClass: CombinedLogger,
		}, {
			provide:  "LoggerService",
			useValue: new LoggerNestjsProxy(),
		},
	],
	exports:   [Logger, "LoggerService"],
})
export class LoggerModule {}