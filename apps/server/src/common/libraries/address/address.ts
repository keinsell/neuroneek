import { AddressCity }       from './address-city.js'
import { AddressState }      from './address-state.js'
import { AddressStreetLine } from './address-street-line.js'
import { CountryCode }       from './country-code.js'
import { PostalCode }        from './postal-code.js'



export type AddressString = string


export interface Address
  {
	 street1 : AddressStreetLine
	 street2? : AddressStreetLine
	 city : AddressCity
	 state? : AddressState
	 postalCode : PostalCode
	 country : CountryCode
  }