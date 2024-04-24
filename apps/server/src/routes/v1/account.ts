import {Body, Controller, Post}             from '@nestjs/common';
import {ApiBody, ApiOperation, ApiProperty} from '@nestjs/swagger';
import {hash, verify}                       from 'argon2';
import {Account, Prisma}                   from 'db';
import {SignJWT}                            from 'jose';
import {randomUUID}                         from 'node:crypto';
import {PrismaService}                      from '../../common/modules/resources/prisma/services/prisma-service.js';
import {__authConfig}                       from '../../configs/global/__config.js';
import {ApiModel}                           from '../../utilities/docs-utils/swagger-api-model.js';
import {ApiAccountMockup}                   from '../../utilities/fixtures/api-account-mockup.js';



export const ApiPropertyAccountEmail = ApiProperty({
	name:        'email',
	description: 'The' + " account's email address",
	example:     ApiAccountMockup.email,
	examples:    ApiAccountMockup._examples.emails,
	type:        String,
});

export const ApiPropertyAccountPassword = ApiProperty({
	name:        'password',
	description: "The account's username",
	example:     ApiAccountMockup.password,
	examples:    ApiAccountMockup._examples.passwords,
});

export const ApiPropertyAccountUsername = ApiProperty({
	name:        'username',
	description: "The account's username",
	example:     ApiAccountMockup.username,
	examples:    ApiAccountMockup._examples.usernames,
});


export class RegisterAccountCommand {
	/**
	 * Represents an email address.
	 * @typedef {string} email
	 */
	@ApiPropertyAccountEmail email: string;

	/**
	 * The password variable is a string that represents a user's password.
	 *
	 * @type {string}
	 */
	@ApiPropertyAccountPassword password: string;

	/**
	 * Represents a username.
	 * @typedef {string} username
	 */
	@ApiPropertyAccountUsername username: string;
}


@ApiModel({
	name:        'Auhenticate',
	description: 'asdasd',
})
export class AuthenticateCommand {
	/**
	 * Represents a username.
	 * @typedef {string} username
	 */
	@ApiPropertyAccountUsername username: string;

	/**
	 * The password variable is a string that represents a user's password.
	 *
	 * @type {string}
	 */
	@ApiPropertyAccountPassword password: string;
}


export interface RegisterAccount {
	username: string;
	password: string;
}


export interface RegisteredAccount {
	id: string;
	username: string;
	password: string;
}


export interface BasicAuthenticate {
	username: string;
	password: string;
}


export interface AuthenticationSucceed {
	accessToken: string;
}


@Controller('account')
export class AccountController {
	private readonly accountRepository: Prisma.AccountDelegate;


	constructor(prismaService: PrismaService) {
		this.accountRepository = prismaService.account;
	}


	@Post() @ApiOperation({
		operationId: 'register',
		summary:     'Register account',
		tags:        ['account'],
	}) @ApiBody({type: RegisterAccountCommand})
	async registerAccount(@Body() body: unknown): Promise<RegisteredAccount> {
		// TODO: Validate input
		const registerAccount = body as RegisterAccount;

		let account: Account | null = await this.accountRepository.findFirst({
			where: {username: registerAccount.username},
		});

		if (!account) {
			const passwordHash = await hash(registerAccount.password);

			account = await this.accountRepository.create({
				data: {
					username: registerAccount.username,
					email:    'keinsell@protonmail.com',
					password: passwordHash,
				},
			});
		} else {
			throw new Error('Account already exists');
		}

		return {
			id:       account.id,
			username: account.username,
			password: account.password,
		};
	}


	async basicAuthenticate(@Body() body: unknown): Promise<AuthenticationSucceed> {
		// TODO: Validate this
		const basicAuthenticate = body as BasicAuthenticate;

		const account = await this.accountRepository.findFirst({
			where: {username: basicAuthenticate.username},
		});

		if (!account) {
			throw new Error('Account not found');
		}

		if (!(
			await verify(account.password, basicAuthenticate.password)
		)) {
			throw new Error('Invalid password');
		}

		const key = new TextEncoder().encode(__authConfig.JWT_SECRET);

		const payload = {
			jti: randomUUID(),
			sub: account.id,
			aud: 'access',
		};

		const plainAccessToken = new SignJWT({...payload});
		plainAccessToken.setExpirationTime('1h');
		plainAccessToken.setProtectedHeader({
			b64: true,
			alg: 'HS256',
		});

		const accessToken = await plainAccessToken.sign(key);

		return {
			accessToken: accessToken,
		};
	}
}
