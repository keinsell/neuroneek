import {beforeEach, describe, expect, it, jest} from '@jest/globals'
import {JwtService} from '@nestjs/jwt';
import {Test, TestingModule} from '@nestjs/testing';
import {hash} from "argon2"
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
        });

        it('should throw exception when incorrect password', () =>
        {
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

            expect(authController.basicAuthentication(credentials)).rejects.toThrowError('Incorrect credentials');
        })


        it('should verify password hash', () => {});

        /**
         * This test ensures that a log is created when an account is registered. It is crucial to have logs in place
         * to be able to debug and trace issues in production; in this case, we should output minimal information
         * to know when a new account was registered.
         */
        it(`should have log`, async () =>
        {
            const loggerSpy = jest.spyOn(authController['logger'], 'log');

            const createdAccount = await authController.basicAuthentication({
                                                                                username: 'test',
                                                                                password: 'password',
                                                                            } as any);

            expect(loggerSpy).toHaveBeenNthCalledWith(1, expect.stringContaining(createdAccount.accessToken));
        });
    })

    describe("whoami", () =>
    {
        it('should throw exception when token not provided', () =>
        {
        });

        it('should return user information', async () =>
        {
            const token  = {accessToken: 'testToken'};
            const result = await authController.whoami(token);

            expect(result).toEqual({username: 'ihavethisacc', id: 'existing-id'});
        })
    })

});