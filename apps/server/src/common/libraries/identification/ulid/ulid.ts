export type ULID =
  string
  & { __brand : 'ULID' };


export function isULID(value : string) : value is ULID
  {
	 const ulidRegex = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/
	 return ulidRegex.test( value )
  }


// TODO: Add createULID function