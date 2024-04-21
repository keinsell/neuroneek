import {RedisModule as NestjsRedisModule} from '@liaoliaots/nestjs-redis'
import {
	Global,
	Module,
}                                         from '@nestjs/common'
import {__config}                         from '../../../configs/global/__config.js'



let REDIS_RETRY_COUNT = 0


@Global() @Module({
	                  imports: [
		                  NestjsRedisModule.forRoot({
			                                            errorLog     : true,
			                                            readyLog     : true,
			                                            closeClient  : true,
			                                            commonOptions: {
				                                            lazyConnect           : true,
				                                            showFriendlyErrorStack: true,
				                                            enableAutoPipelining  : true,
				                                            enableOfflineQueue    : true,
			                                            },
			                                            config       : {
				                                            host            : __config.get('redis').host,
				                                            port            : __config.get('redis').port,
				                                            username        : __config.get('redis').username,
				                                            password        : __config.get('redis').password,
				                                            url             : __config.get('redis').url,
				                                            reconnectOnError: function (err)
				                                            {
					                                            if (REDIS_RETRY_COUNT < 3)
					                                            {
						                                            REDIS_RETRY_COUNT++
						                                            return true
					                                            }

					                                            return false
				                                            }, //				                                            enableOfflineQueue:
				                                            // __config.get('redis').enableOfflineQueue, db :
				                                            // __config.get('redis').db,
			                                            },
		                                            }),
	                  ],
                  })
export class RedisModule
{
}
