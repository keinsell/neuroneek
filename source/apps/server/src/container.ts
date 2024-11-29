// @ts-nocheck

import { Logger, MiddlewareConsumer, Module, OnModuleDestroy, OnModuleInit, RequestMethod } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport";
import { DeveloperToolsModule } from './common/modules/environment/dev-tools/developer-tools.module.js';
import { HealthModule } from './common/modules/observability/healthcheck/health-module.js';
import { SharedModule } from './common/shared-module.js';
import { JwtStrategy } from "./core/identity/authn/jwt-authentication-strategy";
import { FingerprintMiddleware } from './core/middleware/fingerprint.js';
import { DocumentationModule } from './core/modules/documentation/documentation-module.js';
import { GraphqlModule } from './core/modules/graphql/graphql-module.js';
import { AccountController } from "./routes/v1/account"
import { AuthController } from "./routes/v1/authenticate";
import { IngestionController } from "./routes/v1/ingestion";
import { RouteOfAdministrationController } from "./routes/v1/route-of-administration.js"
import { SearchController } from "./routes/v1/search";
import { SubstanceController } from "./routes/v1/substance"
import { SubjectController } from "./routes/v1/subject"


@Module({
  imports: [
    GraphqlModule, SharedModule, DocumentationModule, HealthModule, DeveloperToolsModule, JwtModule.register(
      {
        secret: process.env.JWT_SECRET ?? "secret",
        signOptions: { expiresIn: '30d' }
      }), PassportModule
  ],
  controllers: [
    SubstanceController, RouteOfAdministrationController, AccountController, AuthController, SearchController, IngestionController, SubjectController
  ],
  providers: [JwtStrategy],
})
export class Container
  implements OnModuleInit,
  OnModuleDestroy {
  configure(consumer: MiddlewareConsumer) {
    // TODO: Fingerprinting isn't really needed for all endpoints, and can be optimized to be only used for
    // parts where it's really needed like carts, checkouts, and other parts of app where we have synthetic
    // sessions.
    consumer.apply(FingerprintMiddleware).forRoutes({
      path: '*',
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
