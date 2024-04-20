export abstract class ReadRepository<T>
  {
	 abstract find(id : string) : Promise<T | null>;


	 abstract findAll() : Promise<T[]>;
  }