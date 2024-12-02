export abstract class DataDestination<T>
  {
	 abstract push(payload : T) : Promise<void>;
  }