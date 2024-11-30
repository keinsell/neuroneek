export type UID =
  `${string}_${string}`
  | string


export class UniqueIdentifier
  {
	 private _value : string | undefined
	 private _payloadHash : string | undefined


	 constructor(configuration? : {
		namespace? : string
		strategy? : 'uuid' | 'cuid' | 'ksuid' | 'custom'
	 })
		{}


	 private _namespace : string | undefined

	 get namespace() : string | undefined
		{
		  return this._namespace
		}


	 static generate() : UniqueIdentifier
		{
		  return new UniqueIdentifier()
		}


	 static generateWithNamespace(namespace : string) : UniqueIdentifier
		{
		  return new UniqueIdentifier( {namespace : namespace} )
		}
  }