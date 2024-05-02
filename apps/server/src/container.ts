// @ts-nocheck

import {Logger, MiddlewareConsumer, Module, OnModuleDestroy, OnModuleInit, RequestMethod} from '@nestjs/common';
import {JwtModule}                                                                        from "@nestjs/jwt"
import {DeveloperToolsModule}                                                             from './common/modules/environment/dev-tools/developer-tools.module.js';
import {HealthModule}                                                                     from './common/modules/observability/healthcheck/health-module.js';
import {SharedModule}                                                                     from './common/shared-module.js';
import {FingerprintMiddleware}                                                            from './core/middleware/fingerprint.js';
import {DocumentationModule}                                                              from './core/modules/documentation/documentation-module.js';
import {GraphqlModule}                                                                    from './core/modules/graphql/graphql-module.js';
import {AccountController}                                                                from "./routes/v1/account"
import {RouteOfAdministrationController}                                                  from "./routes/v1/route-of-administration.js"
import {SubstanceController}                                                              from "./routes/v1/substance.js"



@Module({
	imports:     [
		GraphqlModule, SharedModule, DocumentationModule, HealthModule, DeveloperToolsModule, JwtModule,
	],
	controllers: [
		SubstanceController, RouteOfAdministrationController, AccountController,
	],
	providers:   [],
})
export class Container implements OnModuleInit, OnModuleDestroy {
	configure(consumer: MiddlewareConsumer) {
		// TODO: Fingerprinting isn't really needed for all endpoints, and can be optimized to be only used for parts
		// where it's really needed like carts, checkouts, and other parts of app where we have synthetic sessions.
		consumer.apply(FingerprintMiddleware).forRoutes({
			path:   '*',
			method: RequestMethod.ALL,
		});
	}


	async onModuleInit() {
		new Logger('Container').log(`Container was built successfully! 📡 `);
	}


	async onModuleDestroy() {
		new Logger('Container').log(`Container was destroyed successfully! 📡 `);
	}
}
