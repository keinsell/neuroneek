/**
 * Mappers are a pattern used in enterprise application development to provide a consistent and abstracted way to map between different data models. They act as an abstraction layer between the application and the data storage, providing a consistent and simple API for data transformation.
 * A mapper is a component that can be used to convert data from one format or model to another. For example, a mapper can be used to convert data from a database model to a domain model, or from a domain model to a data transfer object (DTO).
 * @see {https://en.wikipedia.org/wiki/Data_mapper_pattern}
 * @see {https://www.martinfowler.com/eaaCatalog/dataMapper.html}
 * @see {https://www.youtube.com/watch?v=7noMLStHcTE}
 */
export abstract class DataMapper<I, O>
	 {
		  /**
			* The `map` method is an abstract method that transforms data from one type to another.
			* It takes an input of type `I` and returns an output of type `O`.
			*
			* This method is intended to be implemented by any class that extends the `DataMapper` class.
			* The implementation should provide the logic to convert or map the input data into the desired output format.
			*
			* @param {I} data - The input data that needs to be transformed.
			* @returns {O} - The transformed data.
			*/
		  public abstract map( data : I ) : O;
		  
		  /**
			* The `reverse` method is an optional abstract method that transforms data from one type to another in reverse.
			* It takes an input of type `O` and returns an output of type `I`.
			*
			* This method is intended to be implemented by any class that extends the `DataMapper` class if reverse mapping is required.
			* The implementation should provide the logic to convert or map the input data back into the original format.
			*
			* @param {O} data - The input data that needs to be transformed back.
			* @returns {I} - The transformed data.
			*/
		  public abstract reverse?( data : O ) : I;
	 }
