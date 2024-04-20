import {
	BadRequestException,
	Body,
	Controller,
	NotFoundException,
	Post,
} from '@nestjs/common';
import {
	ApiBody,
	ApiOperation,
} from '@nestjs/swagger';
import ms                from 'ms';
import { PrismaService } from '../../../common/modules/resources/prisma/services/prisma-service.js';
import { CacheManager }  from '../../../common/modules/storage/cache-manager/contract/cache-manager.js';
import {randomBytes}     from 'node:crypto';
import {
	ApiPropertyAccountUsername,
	createUsername,
}                        from '../../../modules/account/value-objects/username.js';



export class InitiateCertificateBasedAuthentication
{
	@ApiPropertyAccountUsername
	readonly username: string
}


export interface InitiatedCertificateChallenge
{
	readonly ourPublicKey: string
	readonly yourMessage: string
}


export interface GetCertificateBasedAuthenticationChallenge
{
	readonly challenge: string
}


export interface SolveCertificateAuthenticatonChallenge
{
	readonly challengeId: string
	readonly puzzle: string
}


export interface CertificateBasedAuthenticationService
{
	// 1. User requests a proof of possession of a private key by providing his username to a server
	requestProofOfPossessionOfPrivateKey(request: InitiateCertificateBasedAuthentication): Promise<InitiatedCertificateChallenge>

	// 2. Server generates a challenge and sends it to the user
	generateAuthenticationChallenge(request: InitiatedCertificateChallenge): Promise<GetCertificateBasedAuthenticationChallenge>

	// 3. User solves the challenge and sends the solution to the server to get authentcation tokens
	verifyProofOfPossessionOfPrivateKey(request: SolveCertificateAuthenticatonChallenge): Promise<boolean>

}


@Controller('/cbac')
export class CertificateBasedAuthenticationController
{
	private readonly prisma: PrismaService
	private readonly cacheManager: CacheManager

	constructor(
		prisma: PrismaService,
		cacheManager: CacheManager,
	)
	{
		this.prisma = prisma
		this.cacheManager = cacheManager
	}

	@ApiOperation({summary: 'Initiate certificate based authentication', operationId: "request-proof-of-possession-of-private-key"})
	@ApiBody({type: InitiateCertificateBasedAuthentication})
	@Post('/initiate')
	async initiateCertificateBasedAuthentication(@Body() initiateCertificateBasedAuthenticationRequest: InitiateCertificateBasedAuthentication): Promise<InitiatedCertificateChallenge>
	{
		let account: any
		let secureChallengeKey: string | null = null

		const username = createUsername(initiateCertificateBasedAuthenticationRequest?.username).mapErr((err) => {
			throw err
		})._unsafeUnwrap()

		// Find an account requested in body
		account = await this.prisma.account.findUnique({
																													where: {
																														username: username
																													}, include:{
																														PGPKey: true
			}
		                                                          })

		// Generate a secure challenge key
		randomBytes(32, (err, buffer) =>
		{
			if (err)
			{
				throw new Error('Could not generate secure challenge key')
			}
			secureChallengeKey = buffer.toString('hex')
		})

		// Check if an account exists

		if (!account)
		{
			throw new NotFoundException('Account not found')
		}

		if (!account?.PGPKey) {
			throw new BadRequestException('Account do not support certificate-based authentication')
		}

		// Store the secure challenge key in cache
		await this.cacheManager.set(`cbac:${account.id}`, secureChallengeKey, ms("1h"))

		// Encrypt the key with User's Public Key
//		throw new Error('Not implemented')

		// Return the encrypted key to the user
		return {
			ourPublicKey: '',
			yourMessage: '',
		}
	}

	@ApiOperation({summary: 'Verify proof of possession of Private Key', operationId: "verify-possession-of-private-key"})
	@Post('/verify')
	async verifyProofOfPossessionOfPrivateKey(request: InitiateCertificateBasedAuthentication): Promise<null>
	{
		throw new Error('Not implemented')
	}
}
