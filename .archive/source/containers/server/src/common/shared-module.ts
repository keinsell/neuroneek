import {Module}                         from '@nestjs/common'
import {ConfigModule}                   from '../core/modules/configuration/config-module.js'
import {DatabaseModule}                 from '../core/modules/database/database.module.js'
import {AsyncLocalStorageModule}        from './modules/environment/local-storage/async-local-storage-module.js'
import {ContinuationLocalStorageModule} from './modules/environment/local-storage/continuation-local-storage-module.js'
import {EventBusModule}                 from './modules/messaging/event-bus-module.js'
import {ObservabilityModule}            from './modules/observability/observability-module.js'



@Module({
	imports:   [
		ContinuationLocalStorageModule, AsyncLocalStorageModule, ConfigModule.forRoot(), ObservabilityModule,
		DatabaseModule, EventBusModule, EventBusModule,
	],
	providers: [],
	exports:   [
		ObservabilityModule, DatabaseModule, ContinuationLocalStorageModule, AsyncLocalStorageModule, ConfigModule,
		EventBusModule,
	],
})
export class SharedModule {
}
