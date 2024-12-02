import {createParamDecorator, ExecutionContext, Injectable, Logger} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {PrismaService} from "../../modules/database/prisma/services/prisma-service";

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) =>
    {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

@Injectable()
export class JwtStrategy
    extends PassportStrategy(Strategy, "jwt")
    {
        private logger: Logger = new Logger("jwt:strategy")

        constructor(private jwtService: JwtService, private prismaService: PrismaService)
            {
                super({
                          jwtFromRequest  : ExtractJwt.fromAuthHeaderAsBearerToken(),
                          ignoreExpiration: false,
                          secretOrKey     : process.env.JWT_SECRET ?? "secret",
                      });
                this.logger.debug('JwtStrategy Initialized');
            }

        async validate(payload: { sub: string })
            {
                this.logger.debug(`Validating payload: ${JSON.stringify(payload)}`);

                if (!payload)
                    {
                        this.logger.error('Payload is undefined or null');
                        throw new Error('Invalid payload');
                    }

                if (typeof payload !== 'object' || !('sub' in payload))
                    {
                        this.logger.error('Payload is not an object or does not contain "sub" property');
                        throw new Error('Invalid payload');
                    }

                if (typeof payload["sub"] !== 'string')
                    {
                        this.logger.error('Sub property in payload is not a string');
                        throw new Error('Invalid payload');
                    }

                const account = await this.prismaService.account.findUnique({where: {id: payload["sub"]}});

                if (!account)
                    {
                        this.logger.error(`No account found with id: ${payload["sub"]}`);
                        throw new Error('Invalid payload');
                    }

                this.logger.debug(`Payload validated for account ${account.id}`);
                return account;
            }
    }