import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Logger,
    NotFoundException,
    Post,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ApiOkResponse, ApiOperation, ApiProperty} from "@nestjs/swagger"
import {verify} from "@node-rs/argon2";
import {Account} from "../../_gen/account";
import {JwtAuthorizationGuard} from "../../core/identity/authn/components/guards/jwt-authorization-guard";
import {GetUser} from "../../core/identity/authn/jwt-authentication-strategy";
import {PrismaService} from "../../core/modules/database/prisma/services/prisma-service"

export class AccountAuthenticated
    {
        accountId: string;
        accessToken: string;

        constructor(accountId: string, accessToken: string)
            {
                this.accountId   = accountId;
                this.accessToken = accessToken;
            }

        get description()
            {
                return `Account ${this.accountId} authenticated successfully.`
            }
    }

export class IncorrectCredentials
    extends UnauthorizedException
    {
        constructor()
            {
                super('Incorrect credentials');
            }
    }

export class AccountNotFound
    extends NotFoundException
    {
        constructor()
            {
                super('Account not found');
            }
    }

export class PasswordAuthenticaton
    {
        @ApiProperty({example: "elon_musk"}) username!: string;
        @ApiProperty({example: "ISendCarsIntoFuckingSpace"}) password!: string;
    }

@Controller('auth')
export class AuthController
    {
        private readonly logger = new Logger(AuthController.name);

        constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}


        @ApiOperation({
                          summary    : 'Authenticate using basic authentication',
                          description: `Operation will authenticate user using basic authentication and return JWT token.`,
                      }) @Post('password') @HttpCode(HttpStatus.OK)
        async basicAuthentication(@Body() passwordAuthentication: PasswordAuthenticaton)
            {
                // Validate incoming data
                if (!passwordAuthentication?.password || !passwordAuthentication?.username)
                    {
                        throw new BadRequestException('Username and password are required');
                    }

                const user = await this.prismaService.account.findUnique({
                                                                             where: {
                                                                                 username: passwordAuthentication.username,
                                                                             },
                                                                         })

                if (!user)
                    {
                        throw new AccountNotFound();
                    }

                // Validate password using argon2

                const isPasswordValid = await verify(user.password, passwordAuthentication.password)

                if (!isPasswordValid)
                    {
                        throw new IncorrectCredentials();
                    }

                // Create JWT token

                const payload = {
                    username: user.username,
                    sub     : user.id,
                };

                const accessToken = this.jwtService.sign(payload);

                const event = new AccountAuthenticated(user.id, accessToken);

                this.logger.log(event.description);


                return {accessToken};
            }

        // Define "whoami" endpoint
        @ApiOperation({
                          summary    : 'Get current user',
                          description: `Operation will return information about the current user.`,
                          security   : [{
                              bearerAuth: []
                          }],
                          operationId: 'whoami',
                      })
        @ApiOkResponse({type: Account})
        @Post('whoami') @HttpCode(HttpStatus.OK) @UseGuards(JwtAuthorizationGuard)
        async whoami(@GetUser() user: { username: string }): Promise<Account>
            {
                // Find user from database
                const account = await this.prismaService.account.findUnique({
                                                                                where: {
                                                                                    username: user.username,
                                                                                },
                                                                            });

                if (!account)
                    {
                        throw new AccountNotFound();
                    }

                return account;
            }
    }