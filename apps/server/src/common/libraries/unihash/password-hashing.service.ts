import {Inject, Injectable, Logger}          from '@nestjs/common'
import {KDF_PROVIDER_TOKEN}                   from './constraints/KDF_PROVIDER_TOKEN.js'
import {KdfAlgorithm, KeyDerivationFunction} from './key-derivation-functions/key-derivation-function.js'
import {PhcString, SerializedPhcString}      from './types/phc-string.js'
import {UnihashAlgorithm}                     from './unihash-algorithm.js'



@Injectable()
export class PasswordHashing {
	private readonly logger: Logger                                       = new Logger('security:hashing')
	private readonly algorithms: Map<KdfAlgorithm, KeyDerivationFunction> = new Map()


	constructor(@Inject(KDF_PROVIDER_TOKEN) algorithms: KeyDerivationFunction[]) {
		if (algorithms) {
			algorithms.forEach((algorithm) => {
				this.install(algorithm)
			})
		}
	}


	use(algorithm: KdfAlgorithm): UnihashAlgorithm {
		const kdf = this.algorithms.get(algorithm)

		if (!kdf) {
			throw new Error(`Unknown algorithm: ${algorithm}`)
		}

		return new UnihashAlgorithm(kdf)
	}


	install(algorithm: KeyDerivationFunction): void {
		this.algorithms.set(algorithm.name, algorithm)
		this.logger.debug(`Installed algorithm: ${algorithm.name}`)
	}


	uninstall(algorithm: KdfAlgorithm): void {
		this.algorithms.delete(algorithm)
		this.logger.debug(`Uninstalled algorithm: ${algorithm}`)
	}


	which(hash: string): UnihashAlgorithm {
		const algorithm = this.determineAlgorithm(hash)
		return this.use(algorithm)
	}


	private determineAlgorithm(hash: string): KdfAlgorithm {
		const phcString = PhcString.deserialize(hash as unknown as SerializedPhcString)

		const algorithm = Object.values(KdfAlgorithm)
		.find((value) => value === phcString.id)

		if (!algorithm) {
			throw new Error(`Unknown algorithm: ${phcString.id}`)
		}

		this.logger.debug(`Determined algorithm: ${algorithm}`)

		return algorithm
	}
}