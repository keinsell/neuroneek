export type ExceptionNamespace = string


export class Exception
  extends Error
  {
	 public readonly namespace : ExceptionNamespace
	 public readonly code : string
	 public readonly metadata : Record<string, any>
	 public readonly message : string

	 constructor(
		namespace : ExceptionNamespace,
		code : string,
		message : string,
		metadata : Record<string, any> = {},
	 )
		{
		  super( message )

		  this.namespace = namespace
		  this.code      = code
		  this.message   = message
		  this.metadata  = metadata
		}
  }


export class AggregateException
  extends AggregateError
  {
  }