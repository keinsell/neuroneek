/*
 * MIT License
 *
 * Copyright (c) 2024 Jakub Olan <keinsell@protonmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {
  Injectable,
  Logger,
}                                 from '@nestjs/common'
import { CacheManager }           from '../../contract/cache-manager.js'
import { CacheReplacementPolicy } from '../../contract/cache-replacement-policy.js'



CacheReplacementPolicy


@Injectable()
export class InMemoryCacheManager
  extends CacheManager
  {
	 private logger : Logger = new Logger( 'cache_manager::memory' )

	 //noinspection LocalVariableNamingConventionJS
	 private _cache : Map<string, unknown> = new Map<string, unknown>()

	 //noinspection LocalVariableNamingConventionJS
	 private _ttl : Map<string, { expiry : number, timeout : NodeJS.Timeout }> = new Map<string, {
		expiry : number, timeout : NodeJS.Timeout
	 }>()


	 public async clear() : Promise<void>
		{
		  this.logger.debug( `Clearing cache` )
		  this._cache.clear()
		  this._ttl.forEach( (
									  value,
									  key,
									) => {
			 clearTimeout( value.timeout )
		  } )

		  this._ttl.clear()
		  this.logger.verbose( `Cache cleared.` )
		  return Promise.resolve( undefined )
		}


	 public async delete(key : string) : Promise<void>
		{
		  this.logger.debug( `Deleting key "${key}"` )
		  this._cache.delete( key )
		  const ttlObject = this._ttl.get( key )

		  if ( ttlObject )
			 {
				clearTimeout( ttlObject.timeout )
				this._ttl.delete( key )
			 }

		  this.logger.verbose( `Key: ${key} deleted` )
		  return Promise.resolve( undefined )
		}


	 public async exists(key : string) : Promise<boolean>
		{
		  this.logger.debug( `Checking existence for key: ${key}` )
		  const has = this._cache.has( key )
		  this.logger.verbose( `Existence check for key: ${key} completed` )
		  return has
		}


	 //noinspection LocalVariableNamingConventionJS
	 public async get<T = unknown>(key : string) : Promise<T | null>
		{
		  this.logger.debug( `Fetching value for key: ${key}` )
		  const value = this._cache.get( key )

		  if ( value )
			 {
				this.logger.verbose( `Fetched value for key: ${key}` )
				return value as T
			 }

		  return null
		}


	 public async getAll<T = unknown>() : Promise<T[]>
		{
		  return Array.from( this._cache.values() ) as T[]
		}


	 public async keys() : Promise<string[]>
		{
		  return Array.from( this._cache.keys() )
		}


	 public set(
		key : string,
		value : unknown,
		ttl? : number,
	 ) : Promise<void>
		{
		  this.logger.debug( `Setting value for key: ${key} with TTL: ${ttl}` )
		  this._cache.set( key, value )

		  if ( ttl )
			 {
				const timeout = setTimeout( () => {
				  this._cache.delete( key )
				  this._ttl.delete( key )
				}, ttl )

				this._ttl.set( key, {
				  expiry  : Date.now() + ttl,
				  timeout : timeout,
				} )
				this.logger.verbose( `Value set for key: ${key} with TTL: ${ttl}` )
			 }

		  return Promise.resolve( undefined )
		}


	 public async ttl(key : string) : Promise<number>
		{
		  const cacheTtl = this._ttl.get( key )

		  if ( !cacheTtl )
			 {
				return -1
			 }
		  else
			 {
				return Math.max( cacheTtl.expiry - Date.now(), 0 )
			 }
		}
  }