import { Opaque } from 'type-fest'



/** Country code presented in `ISO 3166-1 alpha-2` format.
 *
 * @example "PL" // For "Poland"
 * */
export type CountryCode = Opaque<string, 'ISO_3166-1_alpha-2'>