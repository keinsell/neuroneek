import {beforeEach, describe, expect, it, jest} from '@jest/globals'
import {JwtService} from '@nestjs/jwt';
import {Test, TestingModule} from '@nestjs/testing';
import argon2, {hash} from "@node-rs/argon2"
import {Prisma, PrismaClient} from 'db';
import createPrismaMock from "prisma-mock"
import {createPrismaMockContext} from "../../../test/setup/prisma-context"
import {PrismaService} from "../../core/modules/database/prisma/services/prisma-service"
import {AuthController} from "./authenticate"


describe(AuthController.name, () =>
{
    let authController: AuthController;
    let prismaClient: PrismaClient;
    let prismaService: PrismaService;
    let jwtService: JwtService;

    beforeEach(async () =>
               {
                   const registeredAccount = {
                       username: 'ihavethisacc',
                       password: await hash("lmao_insecure_password"),
                       id      : "existing-id",
                   }

                   prismaClient = createPrismaMock({account: [registeredAccount]}, Prisma.dmmf.datamodel,
                                                   createPrismaMockContext().prisma as any)

                   const module: TestingModule = await Test.createTestingModule({
                                                                                    controllers: [AuthController],
                                                                                    providers  : [
                                                                                        PrismaService, JwtService,
                                                                                    ],
                                                                                })
                       .overrideProvider(PrismaService)
                       .useValue(prismaClient)
                       .overrideProvider(JwtService)
                       .useValue({
                                     sign: jest.fn().mockReturnValue('testToken'),
                                 })
                       .compile();

                   authController = module.get<AuthController>(AuthController);
                   jwtService     = module.get<JwtService>(JwtService);
                   prismaService  = module.get<PrismaService>(PrismaService);
               });

    describe('basicAuthentication', () =>
    {
        it('should throw exception when account not found', () =>
        {
            const credentials = {username: 'nonexistent', password: 'password'};
            expect(authController.basicAuthentication(credentials)).rejects.toThrowError('Account not found');
        });

        it('should throw exception when incorrect password', () =>
        {
            const credentials = {username: 'ihavethisacc', password: 'wrongonethistime'};
            expect(authController.basicAuthentication(credentials)).rejects.toThrowError('Incorrect credentials');
        });

        it('should generate jwt token for user', async () =>
        {
            const credentials = {username: 'ihavethisacc', password: 'lmao_insecure_password'};
            const result      = await authController.basicAuthentication(credentials);

            expect(result).toEqual({accessToken: 'testToken'});
        })

        it('should not authenticate user', async () =>
        {
            const credentials = {username: 'ihavethisacc', password: 'wrongonethistime'};

            await expect(authController.basicAuthentication(credentials)).rejects.toThrowError('Incorrect credentials');
        })


        it('should verify password hash', async () =>
        {
            // Arrange
            const verifySpy   = jest.spyOn(argon2, 'verify');
            const credentials = {username: 'ihavethisacc', password: 'lmao_insecure_password'};

            // Act
            await authController.basicAuthentication(credentials);

            // Assert
            expect(verifySpy).toHaveBeenCalledWith(expect.any(String), credentials.password);
        });

        /**
         * This test ensures that a log is created when an account is registered. It is crucial to have logs in place
         * to be able to debug and trace issues in production; in this case, we should output minimal information
         * to know when a new account was registered.
         */
        it(`should have log`, async () =>
        {
            const loggerSpy = jest.spyOn(authController['logger'], 'log');

            const createdAccount = await authController.basicAuthentication({
                                                                                username: 'ihavethisacc',
                                                                                password: 'lmao_insecure_password',
                                                                            } as any);

            expect(loggerSpy).toHaveBeenNthCalledWith(1, expect.stringContaining("existing-id"));
        });
    })

    describe("whoami", () =>
    {
        it('should throw exception when token not provided', () =>
        {
        });

        it('should return user information', async () =>
        {
            const result = await authController.whoami({username: 'ihavethisacc'});
            expect(result.username).toEqual("ihavethisacc");
        })
    })

});