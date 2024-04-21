import { Buffer }       from 'buffer'
import { KdfAlgorithm } from '../key-derivation-functions/key-derivation-function.js'

// Regular expressions can be encapsulated into a separate validation module
const idRegex      = /^[a-z0-9-]{1,32}$/
const nameRegex    = /^[a-z0-9-]{1,32}$/
const valueRegex   = /^[a-zA-Z0-9/+.-]+$/
const b64Regex     = /^([a-zA-Z0-9/+.-]+|)$/
const decimalRegex = /^((-)?[1-9]\d*|0)$/
const versionRegex = /^v=(\d+)$/


interface PhcParams
  {
	 [ key : string ] : string | number;
  }


interface PhcOptions
  {
	 id : KdfAlgorithm;
	 version? : number;
	 params? : PhcParams;
	 salt? : Buffer;
	 hash? : Buffer;
  }


export type SerializedPhcString = `$${KdfAlgorithm}${string}`;


/**
 * # PHC String
 * String encodings for the output of a password hashing function. Three kinds of strings are defined:
 * - Parameter string: identifies the function and contains values for its parameters.
 * - Salt string: a parameter string that also specifies the salt value.
 * - Hash string: a salt string that also specifies the hash output.
 *
 * ```
 * $<id>[$v=<version>][$<param>=<value>(,<param>=<value>)*][$<salt>[$<hash>]]
 * ```
 *
 * Where:
 *  - `<id>` is the symbolic name for the function
 *  - `<version>` is the algorithm version
 *  - `<param>` is a parameter name
 *  - `<value>` is a parameter value
 *  - `<salt>` is an encoding of the salt
 *  - `<hash>` is an encoding of the hash output
 *
 * @see [phc-string-format](https://github.com/P-H-C/phc-string-format/tree/master)
 * @see [modular-crypt-format](https://passlib.readthedocs.io/en/stable/modular_crypt_format.html)
 */
class PhcString
  {
	 public id : string
	 public version? : number
	 public params? : PhcParams
	 public salt? : Buffer
	 public hash? : Buffer

	 private options : PhcOptions


	 constructor(options : PhcOptions)
		{
		  this.validateOptions( options )
		  this.options = options
		  this.id      = options.id
		  this.version = options.version
		  this.params  = options.params
		  this.salt    = options.salt
		  this.hash    = options.hash
		}


	 public static deserialize(phcstr : SerializedPhcString) : PhcString
		{
		  if ( typeof phcstr !== 'string' || phcstr[ 0 ] !== '$' )
			 {
				throw new TypeError( 'PHC string must be a non-empty string starting with $' )
			 }

		  const fields = phcstr.slice( 1 ).split( '$' )
		  if ( fields.length < 2 )
			 {
				throw new Error( 'Invalid PHC string format: Missing required fields' )
			 }

		  const options : PhcOptions = {id : fields.shift() as KdfAlgorithm}

		  if ( fields.length > 0 && versionRegex.test( fields[ 0 ] ) )
			 {
				const versionMatch = versionRegex.exec( fields.shift()! )
				if ( !versionMatch )
				  {
					 throw new Error( 'Version information is invalid' )
				  }
				options.version = parseInt( versionMatch[ 1 ], 10 )
			 }

		  // Process params (parameters are not base64 encoded, so we check for the presence of '=')
		  if ( fields.length > 0 && fields[ 0 ].includes( '=' ) )
			 {
				const paramsString     = fields.shift()!
				const paramStringPairs = paramsString.split( ',' )
				options.params         = paramStringPairs.reduce( (
																					 acc,
																					 pair,
																				  ) => {
				  const [ key, value ] = pair.split( '=' )
				  if ( !key || !value )
					 {
						throw new Error( 'Parameter string format is invalid' )
					 }
				  acc[ key ] = decimalRegex.test( value ) ? parseInt( value, 10 ) : value
				  return acc
				}, {} as PhcParams )
			 }

		  // Process salt (salt and hash are base64 encoded, but may not include padding)
		  if ( fields.length > 0 )
			 {
				options.salt = Buffer.from( fields.shift()!, 'base64' )
			 }

		  // Process hash
		  if ( fields.length > 0 )
			 {
				options.hash = Buffer.from( fields.shift()!, 'base64' )
			 }

		  if ( fields.length !== 0 )
			 {
				throw new Error( 'PHC string contains unexpected fields' )
			 }

		  return new PhcString( options )
		}


	 public serialize() : SerializedPhcString
		{
		  const fields : string[] = [ `$${this.id}` ] // id is required and must be first

		  if ( this.version !== undefined )
			 {
				fields.push( `v=${this.version}` )
			 }

		  if ( this.params )
			 {
				const paramsArray = Object.entries( this.params )
												  .map( ([ key, value ]) => `${key}=${value}` )
				if ( paramsArray.length > 0 )
				  {
					 fields.push( paramsArray.join( ',' ) )
				  }
			 }

		  if ( this.salt )
			 {
				// Ensure that Base64 is URL safe and remove padding if necessary.
				fields.push( this.salt.toString( 'base64' ).replace( /=+$/, '' ) )
			 }

		  if ( this.hash )
			 {
				// Ensure that Base64 is URL safe and remove padding if necessary.
				fields.push( this.hash.toString( 'base64' ).replace( /=+$/, '' ) )
			 }

		  return fields.join( '$' ) as SerializedPhcString
		}


	 private validateOptions(options : PhcOptions) : void
		{
		  if ( !options || typeof options !== 'object' )
			 {
				throw new TypeError( 'options must be an object' )
			 }

		  if ( typeof options.id !== 'string' || !idRegex.test( options.id ) )
			 {
				throw new TypeError( `id must be a string and satisfy ${idRegex}` )
			 }

		  if ( options.version !== undefined && (
			 typeof options.version !== 'number' || options.version < 0 || !Number.isInteger( options.version )
		  ) )
			 {
				throw new TypeError( 'version must be a positive integer number' )
			 }

		  if ( options.params )
			 {
				this.validateParams( options.params )
			 }

		  if ( options.salt && !Buffer.isBuffer( options.salt ) )
			 {
				throw new TypeError( 'salt must be a Buffer' )
			 }

		  if ( options.hash && !Buffer.isBuffer( options.hash ) )
			 {
				throw new TypeError( 'hash must be a Buffer' )
			 }
		}


	 private validateParams(params : PhcParams) : void
		{
		  const paramKeys = Object.keys( params )

		  if ( !paramKeys.every( key => nameRegex.test( key ) ) )
			 {
				throw new TypeError( `params names must satisfy ${nameRegex}` )
			 }

		  paramKeys.forEach( key => {
			 const value = params[ key ]
			 if ( typeof value === 'number' && !decimalRegex.test( value.toString() ) )
				{
				  throw new TypeError( 'numeric params values must satisfy the decimalRegex' )
				}
			 if ( typeof value === 'string' && !valueRegex.test( value ) )
				{
				  throw new TypeError( `string params values must satisfy ${valueRegex}` )
				}
		  } )
		}
  }


export { PhcString }
