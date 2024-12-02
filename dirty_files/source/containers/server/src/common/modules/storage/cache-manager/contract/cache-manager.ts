import type { CacheReplacementPolicy } from './cache-replacement-policy.js'
import type { ICache }                 from './cache.js'



/**
 * Represents an abstract class for managing cache.
 */
export abstract class CacheManager
  {
	 public cache : ICache

	 constructor(
		cache : ICache,
		configuration? : {
		  replacementPolicy : CacheReplacementPolicy
		},
	 )
		{
		  this.cache = cache
		}

	 //noinspection FunctionNamingConventionJS
	 /**
	  * Retrieves the value associated with the given key.
	  *
	  * @param {string} key - The key of the value to be retrieved.
	  * @returns {Promise<T | null>} A promise that resolves with the value if found, or null if not found.
	  */
	 abstract get<T = unknown>(key : string) : Promise<T | null>;


	 //noinspection FunctionNamingConventionJS
	 /**
	  * Sets a value for a given key in the cache with an optional time-to-live.
	  *
	  * @param {string} key - The key to set the value for.
	  * @param {T} value - The value to be set.
	  * @param {number} [ttl] - The time-to-live value in milliseconds (optional).
	  * @return {Promise<void>} - A promise that resolves when the value is set in the cache.
	  */
	 abstract set<T = unknown>(
		key : string,
		value : T,
		ttl? : number,
	 ) : Promise<void>;


	 /**
	  * Deletes a value from the cache using the specified key.
	  *
	  * @param {string} key - The key of the value to delete from the cache.
	  * @return {Promise<void>} - A promise that resolves when the value is successfully deleted from the cache.
	  */
	 abstract delete(key : string) : Promise<void>;


	 /**
	  * Checks if a key exists in the system.
	  *
	  * @param {string} key - The key to check existence for.
	  * @returns {Promise<boolean>} - A Promise that resolves to a boolean value indicating whether the key exists or
	  *   not.
	  */
	 abstract exists(key : string) : Promise<boolean>;


	 //noinspection FunctionNamingConventionJS
	 /**
	  * Retrieves the time to live (TTL) of a given key.
	  *
	  * @param {string} key - The key for which to retrieve the TTL.
	  * @returns {Promise<number>} - A Promise that resolves to the TTL of the key, in seconds.
	  */
	 abstract ttl(key : string) : Promise<number>;


	 /**
	  * Clears the contents of an element.
	  *
	  * @returns {Promise<void>} A promise that resolves once the element contents have been cleared.
	  */
	 abstract clear() : Promise<void>;


	 /**
	  * Retrieves the keys from some source.
	  *
	  * @return {Promise<string[]>} A promise that resolves with an array of keys.
	  */
	 abstract keys() : Promise<string[]>;


	 /**
	  * Retrieves all objects of type T.
	  *
	  * @returns {Promise<T[]>} A promise that resolves with an array of objects of type T.
	  *
	  * @template T The type of objects to retrieve.
	  */
	 abstract getAll<T = unknown>() : Promise<T[]>;
  }