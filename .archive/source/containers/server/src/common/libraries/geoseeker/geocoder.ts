// https://gist.github.com/joyrexus/6510992
import { Address }         from '../address/address.js'
import { GeocodeProvider } from './contract/geocode-provider.js'



export abstract class Geocoder
  {
	 private providers : GeocodeProvider[] = []


	 abstract geocode(query : any) : Promise<Address[]>;


	 abstract reverse(query : any) : Promise<Address[]>;


	 abstract suggest(query : any) : Promise<any[]>;


	 registerProvider(provider : GeocodeProvider)
		{
		  this.providers.push( provider )
		}


	 getFirstProvider() : GeocodeProvider
		{
		  return this.providers[ 0 ]
		}
  }