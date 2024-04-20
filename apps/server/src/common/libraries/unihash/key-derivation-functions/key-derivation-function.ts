import { PhcString } from '../types/phc-string.js'
import { Salt }      from '../types/salt.js'



export enum KdfAlgorithm
  {
	 Argon2id = 'argon2id',
	 Argon2i  = 'argon2i',
	 Argon2d  = 'argon2d',
	 Scrypt   = 'scrypt',
	 Pbkdf2   = 'pbkdf2',
	 Bcrypt   = 'bcrypt',
  }


/** key derivation function (KDF) */
export abstract class KeyDerivationFunction
  {
	 /**
	  * The name of the cryptographic algorithm.
	  *
	  * @typedef {('argon2id' | 'argon2i' | 'argon2d' | 'scrypt' | 'pbkdf2' | 'bcrypt')} AlgorithmName
	  */
	 abstract name : KdfAlgorithm


	 /**
	  * Derive a key from the given password with the provided salt and options.
	  *
	  * @param {string} password - The password to derive the key from.
	  * @param {Salt} salt - The salt to use in the key derivation process.
	  * @param {any} [options] - Additional options for key derivation (optional).
	  * @returns {Promise<Buffer>} A promise that resolves to the derived key as a Buffer.
	  */
	 abstract deriveKey(
		password : string,
		salt : Salt,
		options? : any,
	 ) : Promise<PhcString>


	 abstract verify(
		hash : PhcString,
		plain : string,
	 ) : Promise<boolean>
  }