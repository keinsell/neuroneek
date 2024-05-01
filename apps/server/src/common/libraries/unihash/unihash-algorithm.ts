import {Logger}                         from '@nestjs/common'
import {KeyDerivationFunction}          from './key-derivation-functions/key-derivation-function.js'
import {PhcString, SerializedPhcString} from './types/phc-string.js'
import {Salt}                           from './types/salt.js'



export class UnihashAlgorithm {
	private readonly logger: Logger


	constructor(private readonly kdf: KeyDerivationFunction) {
		this.logger = new Logger(`${kdf.name}`)
	}


	async hash(plain: string, salt?: Salt): Promise<SerializedPhcString> {
		this.preHash(plain)
		const phcString = await this.kdf.deriveKey(plain, salt as any)
		this.postHash(plain, phcString.serialize())
		return phcString.serialize()
	}


	async verify(hash: string, plain: string): Promise<boolean> {
		this.preVerify(hash, plain)
		const result = await this.kdf.verify(PhcString.deserialize(hash as unknown as SerializedPhcString), plain)
		this.postVerify(hash, plain, result)
		return result
	}


	private preHash(plain: string): void {
		this.logger.debug(`Generating hash...`, {value: plain})
	}


	private postHash(plain: string, hash: string): void {
		this.logger.verbose(`Generated hash`, {
			value: plain,
			hash:  this.formatHash(hash),
		})
	}


	private preVerify(hash: string, plain: string): void {
		this.logger.debug(`Verifying hash...`, {
			value: plain,
			hash:  this.formatHash(hash),
		})
	}


	private postVerify(hash: string, plain: string, result: boolean): void {
		this.logger.verbose(`Verified hash`, {
			value:  plain,
			hash:   this.formatHash(hash),
			result: result,
		})
	}


	/** Return last 20 characters of hash */
	private formatHash(hash: string): string {
		return `${hash.slice(0, 10)}...${hash.slice(hash.length - 10)}`
	}
}