import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Post,
    UnauthorizedException
} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ApiOperation, ApiProperty} from "@nestjs/swagger"
import {verify} from "argon2";
import {PrismaService} from "../../core/modules/database/prisma/services/prisma-service"

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
        @ApiProperty({example: "ISendCarsToSpace"}) password!: string;
    }

@Controller('auth')
export class AuthController
    {
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

                return {accessToken};
            }

        // Define "whoami" endpoint
        @ApiOperation({
                          summary    : 'Get current user',
                          description: `Operation will return information about the current user.`,
                      }) @Post('whoami') @HttpCode(HttpStatus.OK)
        async whoami(@Body() token: { accessToken: string })
            {
                // Validate incoming data
                if (!token?.accessToken)
                    {
                        throw new BadRequestException('Token is required');
                    }

                // Verify token
                const payload = this.jwtService.verify(token.accessToken);

                return {username: payload.username};
            }
    }