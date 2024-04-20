import { Module }                from '@nestjs/common'
import { KDF_PROVIDER_TOKEN }    from './constraints/KDF_PROVIDER_TOKEN.js'
import { Argon2Kdf }             from './key-derivation-functions/argon2.kdf.js'
import { KeyDerivationFunction } from './key-derivation-functions/key-derivation-function.js'
import { PasswordHashing }       from './password-hashing.service.js'



@Module( {
			  imports     : [],
			  controllers : [],
			  providers   : [
				 {
					provide    : KDF_PROVIDER_TOKEN,
					useFactory : () : KeyDerivationFunction[] => {
					  return [
						 new Argon2Kdf(),
					  ]
					},
				 }, PasswordHashing,
			  ],
			  exports     : [ PasswordHashing ],
			} )
export class UnihashModule
  {
  }