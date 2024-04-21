import typia, {createAssert} from 'typia'
import {Opaque}              from '../../common/libraries/opaque.js'



type IIPV4 =
	string
	& typia.tags.Format<'ipv4'>;

/**
 * Represents an IP address in the format 'xxx.xxx.xxx.xxx'.
 */
export type IPV4 = Opaque<IIPV4, 'ipv4'>

const assertIpAddressV4 = createAssert<IIPV4>()

export function createIpAddressV4(value: string): IPV4 {
	return assertIpAddressV4(value) as IPV4
}