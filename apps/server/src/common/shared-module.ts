import {Module}                         from '@nestjs/common'
import {ConfigModule}                   from '../core/modules/configuration/config-module.js'
import {XcacheModule}                   from '../kernel/modules/cache/xcache-module.js'
import {DatabaseModule}                 from './modules/database/database.module.js'
import {AsyncLocalStorageModule}        from './modules/environment/local-storage/async-local-storage-module.js'
import {ContinuationLocalStorageModule} from './modules/environment/local-storage/continuation-local-storage-module.js'
import {EventBusModule}                 from './modules/messaging/event-bus-module.js'
import {ObservabilityModule}            from './modules/observability/observability-module.js'



@Module({
	imports:   [
		ContinuationLocalStorageModule, AsyncLocalStorageModule, ConfigModule.forRoot(), ObservabilityModule,
		DatabaseModule, EventBusModule, EventBusModule, XcacheModule, //		        SessionMiddlewareModule.forRoot({
		//			                                        session: {
		//				                                        secret           : 'secretomitted',
		//				                                        rolling          : false,
		//				                                        resave           : false,
		//				                                        saveUninitialized: false,
		//			                                        },
		//		                                        }), //
		// https://stackoverflow.com/questions/56046527/express-session-req-session-touch-not-a-function
		// CookieSessionModule.forRoot({ session: { name: 'session', secret: 'secretomitted', maxAge: 0 } })
	],
	providers: [],
	exports:   [
		ObservabilityModule, DatabaseModule, ContinuationLocalStorageModule, AsyncLocalStorageModule, ConfigModule,
		EventBusModule, XcacheModule,
	],
})
export class SharedModule {
}
