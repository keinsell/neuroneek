import { Module }               from '@nestjs/common'
import { CacheManager }         from './contract/cache-manager.js'
import { InMemoryCacheManager } from './provider/cache-manager/in-memory-cache-manager.js'



@Module( {
			  imports   : [],
			  providers : [
				 {
					provide  : CacheManager,
					useClass : InMemoryCacheManager,
				 },
			  ],
			  exports   : [ CacheManager ],
			} )
export class CacheManagerModule {}