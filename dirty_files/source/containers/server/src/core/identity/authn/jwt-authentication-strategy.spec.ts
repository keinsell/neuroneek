import {beforeEach, describe, expect, it} from '@jest/globals'
import {JwtService} from '@nestjs/jwt';
import {Test, TestingModule} from '@nestjs/testing';
import {hash} from "@node-rs/argon2";
import createPrismaMock from "prisma-mock";
import {createPrismaMockContext} from "../../../../test/setup/prisma-context";
import {Prisma} from "../../modules/database/prisma/prisma";
import {PrismaService} from "../../modules/database/prisma/services/prisma-service";
import {JwtStrategy} from "./jwt-authentication-strategy";


describe('JwtStrategy', () =>
{
    let strategy: JwtStrategy;
    let jwtService: JwtService;
    let prismaClient: any;
    let prismaService: PrismaService;

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
                                                                                    providers: [JwtStrategy, JwtService, PrismaService],
                                                                                })
                       .overrideProvider(PrismaService)
                       .useValue(prismaClient)
                       .compile();

                   strategy      = module.get<JwtStrategy>(JwtStrategy);
                   jwtService    = module.get<JwtService>(JwtService);
                   prismaService = module.get<PrismaService>(PrismaService);
               });

    it('should throw an error if payload is not provided', async () =>
    {
        await expect(strategy.validate(undefined as any)).rejects.toThrow('Invalid payload');
    });

    it('should throw an error if payload is not an object', async () =>
    {
        await expect(strategy.validate('not an object' as any)).rejects.toThrow('Invalid payload');
    });

    it('should throw an error if payload does not contain a sub property', async () =>
    {
        await expect(strategy.validate({} as any)).rejects.toThrow('Invalid payload');
    });

    it('should throw an error if sub property is not a string', async () =>
    {
        await expect(strategy.validate({sub: 123} as any)).rejects.toThrow('Invalid payload');
    });

    it('should throw an error if account does not exist', async () =>
    {


        await expect(strategy.validate({sub: 'nonexistent'})).rejects.toThrow('Invalid payload');
    });

    it('should return the account if payload is valid and account exists', async () =>
    {
        const result = await strategy.validate({sub: 'existing-id'});

        expect(result.username).toEqual("ihavethisacc");
        expect(result.id).toEqual("existing-id");
    });
});