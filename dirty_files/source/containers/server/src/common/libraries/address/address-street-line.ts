/** Address Line 1 is the first line in a street address and belongs below the "Recipient" line. Address Line 1
 * s hould contain the building or house number, predirectionals, street name/PO Box, postdirectionals, and street
 * suffix. If a secondary address field (e.g. apartment, floor, suite, etc.) isn’t provided on the address form, the
 * unit information can also be included at the end of address line 1.
 */
export type AddressStreetLine =
  string
  | {
	 streetName : string
	 streetNumber : number
	 streetSuffix : string
  }