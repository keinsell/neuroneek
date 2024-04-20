export abstract class DataSource<E>
  {
	 protected _data : E


	 public provide(data : E)
		{
		  this._data = data
		}


	 abstract fetch(identifier : string) : Promise<E>;


	 public async pull() : Promise<E>
		{
		  return this._data
		}
  }