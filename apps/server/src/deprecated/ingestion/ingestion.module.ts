import { DependencyInjectionModule } from '../../shared/module.js'
import { CreateIngestionService } from './create-ingestion/create-ingestion.service.js'

export class IngestionModule extends DependencyInjectionModule {
	register(): void {
		this.containerBuilder.registerAndUse(CreateIngestionService)
	}
}
