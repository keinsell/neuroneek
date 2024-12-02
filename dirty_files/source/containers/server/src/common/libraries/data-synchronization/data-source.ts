export abstract class DataSource<E>
  {
	 protected _data : E | undefined


	 public provide(data : E)
		{
		  this._data = data
		}


	 abstract fetch(identifier : string) : Promise<E>;


	 public async pull() : Promise<E | undefined>
		{
		  return this._data
		}
  }