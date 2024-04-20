import {
	CacheInterceptor,
	CacheModule,
}                        from '@nestjs/cache-manager'
import {Module}          from '@nestjs/common'
import {APP_INTERCEPTOR} from '@nestjs/core'
import ms                from 'ms'



@Module({
	        imports  : [
		        CacheModule.register({
			                             isGlobal: true,
			                             ttl     : ms('5s'),
			                             max     : 1000,
		                             }),
	        ],
	        providers: [
		        {
			        provide : APP_INTERCEPTOR,
			        useClass: CacheInterceptor,
		        },
	        ],
	        exports  : [],
        })
export class XcacheModule
{
}
