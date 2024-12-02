// TODO: https://linear.app/keinsell/issue/PROD-94/add-value-object-base-class
/**
 * Represents a value object.
 * @template T - The type of value that the object holds.
 */
export abstract class ValueObject<T>
  {
	 private readonly value : unknown


	 protected constructor(value : unknown)
		{
		  this.value = value
		}


	 static wrap<T>(value : unknown) : ValueObject<T>
		{
		  const valueObject      = value as ValueObject<T>
		  const validationResult = valueObject.validate()

		  if ( !validationResult )
			 {
				throw new Error( 'Invalid value' )
			 }
		  else
			 {
				return valueObject
			 }
		}


	 public unwrap() : T
		{
		  const validationResult = this.validate()

		  if ( !validationResult )
			 {
				throw new Error( 'Invalid value' )
			 }
		  else
			 {
				return this.value as T
			 }
		}


	 abstract validate() : boolean


	 public equals(other : ValueObject<T>) : boolean
		{
		  return this.unwrap() === other.unwrap()
		}
  }