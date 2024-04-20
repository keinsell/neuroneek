import {Module}                         from '@nestjs/common'
import {ConfigModule}                   from '../kernel/core/configuration/config-module.js'
import {XcacheModule}                   from '../kernel/modules/cache/xcache-module.js'
import {RedisModule}                    from '../kernel/resource/redis/redis.module.js'
import {AccountModule}                  from '../modules/account/account.module.js'
import {AuthenticationModule}           from '../modules/authentication/authentication-module.js'
import {DatabaseModule}                 from './modules/database/database.module.js'
import {AsyncLocalStorageModule}        from './modules/environment/local-storage/async-local-storage-module.js'
import {ContinuationLocalStorageModule} from './modules/environment/local-storage/continuation-local-storage-module.js'
import {EventBusModule}                 from './modules/messaging/event-bus-module.js'
import {ObservabilityModule}            from './modules/observability/observability-module.js'



@Module({
	        imports  : [
		        AccountModule,
		        AuthenticationModule,
		        ContinuationLocalStorageModule,
		        AsyncLocalStorageModule,
		        ConfigModule.forRoot(),
		        ObservabilityModule,
		        DatabaseModule,
		        EventBusModule,
		        RedisModule,
		        EventBusModule,
		        XcacheModule,
		        //		        SessionMiddlewareModule.forRoot({
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
	        exports  : [
		        ObservabilityModule,
		        DatabaseModule,
		        ContinuationLocalStorageModule,
		        AsyncLocalStorageModule,
		        ConfigModule,
		        EventBusModule,
		        RedisModule,
		        XcacheModule,
	        ],
        })
export class SharedModule
{
}
