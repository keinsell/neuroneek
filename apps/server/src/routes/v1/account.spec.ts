import {beforeEach, describe, expect, it, jest}  from '@jest/globals'
import {JwtService}                              from '@nestjs/jwt';
import {Test, TestingModule}                     from '@nestjs/testing';
import argon2, {hash}                            from "argon2"
import {Prisma, PrismaClient}                    from 'db';
import createPrismaMock                          from "prisma-mock"
import {createPrismaMockContext}                 from "../../../test/setup/prisma-context"
import {PrismaService}                           from "../../core/modules/database/prisma/services/prisma-service"
import {AccountController, AccountUsernameTaken} from "./account"



describe('AccountController', () => {
	let accountController: AccountController;
	let prismaClient: PrismaClient;
	let prismaService: PrismaService;
	let jwtService: JwtService;

	beforeEach(async () => {
		const accountWhichTakenUsername = {
			username: 'usernamestealer',
			password: "password",
			id:       "existing-id",
		}

		prismaClient = createPrismaMock({account: [accountWhichTakenUsername]}, Prisma.dmmf.datamodel, createPrismaMockContext().prisma as any)

		const module: TestingModule = await Test.createTestingModule({
			controllers: [AccountController],
			providers:   [
				{
					provide:  PrismaService,
					useValue: prismaClient,
				}, {
					provide:  JwtService,
					useValue: {
						sign: jest.fn(),
					},
				},
			],
		}).compile();

		accountController = module.get<AccountController>(AccountController);
		jwtService        = module.get<JwtService>(JwtService);
		prismaService     = module.get<PrismaService>(PrismaService);
	});

	describe('register', () => {
		it('should throw BadRequestException when username is missing', () => {
			expect(accountController.register({password: 'password'} as any)).rejects.toThrowError('Username and password are required');
		});

		it('should throw BadRequestException when password is missing', () => {
			expect(accountController.register({username: 'test'} as any)).rejects.toThrowError('Username and password are required');
		});

		it('should throw BadRequestException when username and password are missing', () => {
			expect(accountController.register({} as any)).rejects.toThrowError('Username and password are required');
		});

		it('should hash password with argon2', async () => {
			const user         = {
				username: 'test',
				password: 'password',
			};
			const hashPassword = await hash(user.password);

			jest.spyOn(argon2, 'hash').mockResolvedValueOnce(hashPassword);

			await accountController.register(user);

			expect(argon2.hash).toHaveBeenCalledWith(user.password);
			await expect(argon2.verify(hashPassword, user.password)).resolves.toBeTruthy();
		});

		it('should save account', async () => {
			const user         = {
				username: 'test',
				password: 'password',
			};
			const hashPassword = await hash(user.password);

			jest.spyOn(argon2, 'hash').mockResolvedValueOnce(hashPassword);
			const createSpy = jest.spyOn(prismaService.account, 'create');

			const response = await accountController.register(user);

			expect(createSpy).toHaveBeenCalledWith({
				data: {
					username: user.username,
					password: hashPassword,
				},
			});

			expect(response).toEqual({
				id:       expect.any(String),
				username: user.username,
				password: hashPassword,
			});
		});

		it('should throw when username is taken', async () => {
			const user = {
				username: 'usernamestealer',
				password: 'password',
			};

			await expect(accountController.register(user)).rejects.toThrowError(AccountUsernameTaken);
		});
	})

});