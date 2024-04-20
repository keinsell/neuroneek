import {
	Injectable,
	Logger,
}                            from '@nestjs/common';
import { PhcString }         from '../../../common/libraries/unihash/types/phc-string.js';
import { DbContextModel }    from '../../../common/modules/database/db-context-model.js';
import { PrismaService }     from '../../../common/modules/resources/prisma/services/prisma-service.js';
import { Account }           from '../entities/account.js';
import { DbContextModelAccountCreatePayloadMapper } from '../models/account/account-create-model.js';
import { AccountEntityMapper } from '../models/account/account-entity-model.js';
import { AccountEmail }      from '../value-objects/account-email.js';
import { AccountStatus }     from '../value-objects/account-status.js';
import { Password }          from '../value-objects/password.js';
import { Username }          from '../value-objects/username.js';
import { AccountRepository } from './account-repository.js';



@Injectable()
export class PrismaAccountRepository extends AccountRepository {
	private logger: Logger = new Logger('domain:repository:prisma')


	constructor(private prismaService: PrismaService) {
		super()
	}


	public async findByEmail(email: string): Promise<Account | null> {
		this.logger.debug(`Searching account entity by email`, {email})

		const maybeAccount = await this.prismaService.account.findFirst({
			where: {
				email: email,
			},
		})

		if (!maybeAccount) {
			this.logger.debug(`Searching account entity by email resulted in no results`, {email})
			return null
		}

		const account = maybeAccount as DbContextModel.Account.Entity

		this.logger.debug(`Found account entity by email`, {
			email,
			account,
		})

		return Account.build({
			email: AccountEmail.create({address: account.email as any, isVerified: account.email_verified}),
			id: account.id,
			status: AccountStatus.ACTIVE,
			groups: [],
			password: Password.fromHash(account.password as any),
			username: account.username as Username,
		                     })
	}


	public async findByUsername(username: Username): Promise<Account | null> {
		this.logger.debug(`findByUsername()`)

		let maybeAccount: DbContextModel.Account.Entity | null = null

		try {
			maybeAccount = await this.prismaService.account.findFirst({
				where: {
					username: username,
				},
			}) as DbContextModel.Account.Entity | null
		} catch (e) {
			this.logger.error(e)
		}

		if (!maybeAccount) {
			this.logger.verbose(`findByUsername() => null`)
			return null
		}

		const account = maybeAccount

		this.logger.debug(`findByUsername() => Account`)

		return Account.build({
			                     email: AccountEmail.create({address: account.email as any, isVerified: account.email_verified}),
			                     id: account.id,
			                     status: AccountStatus.ACTIVE,
			                     groups: [],
			                     password: Password.fromHash(account.password as any),
			                     username: account.username as Username,
		                     })
	}


	public async findByUsernameFields(username: string): Promise<Account | null> {
		// Find domain by provided username, try to fit it into the username
		// and email fields
		let maybeAccount: DbContextModel.Account.Entity | null = null

		try {
			maybeAccount = await this.prismaService.account.findFirst({
				where: {
					OR: [
						{username: username}, {email: username},
					],
				},
			}) as DbContextModel.Account.Entity | null
		} catch (e) {
			this.logger.error(e)
		}

		this.logger.verbose(`findByUsernameFields(${username}) => ${JSON.stringify(maybeAccount)}`)

		if (!maybeAccount) {
			return null
		}

		const account = maybeAccount

		return new AccountEntityMapper().map(account)
	}


	public async create(identity: Account): Promise<Account> {
		let entity: DbContextModel.Account.Entity

		try {
			entity = await this.prismaService.account.create({
				data: DbContextModelAccountCreatePayloadMapper(identity),
			})
		} catch (e) {
			this.logger.error(e)
			throw e
		}

		return new AccountEntityMapper().map(entity)
	}


	public delete(entity: Account): Promise<void> {
		return Promise.resolve(undefined)
	}


	async exists(entity: Account): Promise<boolean> {
		const count = await this.prismaService.account.count({
			where: {
				OR: [
					{email: entity.email.address}, {username: entity.username}, {id: entity.id},
				],
			},
		})

		return count > 0
	}


	public async findById(id: string): Promise<Account | null> {
		const entity = await this.prismaService.account.findFirst({
			where: {
				id: id,
			},
		})

		if (entity) {
			return new AccountEntityMapper().map(entity)
		} else {
			return null
		}
	}


	public async update(entity: Account): Promise<Account> {
		const account = await this.prismaService.account.update({
			where: {
				id: entity.id,
			},
			data:  {
				email: entity.email.address,
			},
		})

		return new AccountEntityMapper().map(account)
	}

}
