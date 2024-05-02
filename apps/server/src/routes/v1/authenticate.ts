import {PrismaAdapter}                        from "@lucia-auth/adapter-prisma"
import {Controller, Injectable, Logger, Post} from '@nestjs/common'
import {Lucia}                                from "lucia";
import {isProduction}                         from "../configs/helper/is-production"
import {PrismaService}                        from "../core/modules/database/prisma/services/prisma-service"



@Injectable()
export class LuciaPrismaAdapter {
	public adapter: PrismaAdapter<any>


	constructor(private readonly prismaService: PrismaService) {
		this.adapter = new PrismaAdapter(prismaService.session, prismaService.account)
	}
}


@Injectable()
export class LuciaService extends Lucia {
	constructor(private readonly _adapter: LuciaPrismaAdapter) {
		super(_adapter.adapter, {
			sessionCookie: {
				attributes: {
					secure: isProduction(),
				},
			},
		})
	}
}


declare module "lucia" {
	interface Register {
		Lucia: typeof LuciaService;
	}
}


@Controller('authenticate')
export class Authenticate {
	private logger: Logger = new Logger('authentication::controller')


	@Post("basic")
	async basic() {
		this.logger.debug("Basic authentication")
	}
}