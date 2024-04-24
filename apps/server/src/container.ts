import {CacheInterceptor}                                                                  from '@nestjs/cache-manager';
import {Logger, MiddlewareConsumer, Module, OnModuleDestroy, OnModuleInit, RequestMethod} from '@nestjs/common';
import {APP_INTERCEPTOR}                                                                   from '@nestjs/core';
import Sentry                                                                              from '@sentry/node';
import {DocumentationModule}                                                               from './common/modules/documentation/documentation-module.js';
import {DeveloperToolsModule}                                                              from './common/modules/environment/dev-tools/developer-tools.module.js';
import {HealthModule}                                                                      from './common/modules/observability/healthcheck/health-module.js';
import {CacheManagerModule}                                                                from './common/modules/storage/cache-manager/cache-manager-module.js';
import {SharedModule}                                                                      from './common/shared-module.js';
import {CertificateBasedAuthenticationController}                                          from './kernel/modules/identity/cbac.js';
import {SingleSignOnController}                                                            from './kernel/modules/identity/sso/sso.js';
import {GraphqlModule}                                                                     from './kernel/platform/gql/graphql-module.js';
import {FingerprintMiddleware}                                                             from './kernel/platform/http/middleware/fingerprint.js';
import {AccountController}                                                                 from './routes/v1/account.js';



@Module({
	imports:     [
		GraphqlModule, SharedModule, DocumentationModule, HealthModule, DeveloperToolsModule, CacheManagerModule,
	],
	controllers: [
		SingleSignOnController, CertificateBasedAuthenticationController, AccountController,
	],
	providers:   [
		{
			provide:  APP_INTERCEPTOR,
			useClass: CacheInterceptor,
		},
	],
})
export class Container implements OnModuleInit, OnModuleDestroy {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(Sentry.Handlers.requestHandler()).forRoutes({
			path:   '*',
			method: RequestMethod.ALL,
		});
		consumer.apply(Sentry.Handlers.tracingHandler()).forRoutes({
			path:   '*',
			method: RequestMethod.ALL,
		});
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
