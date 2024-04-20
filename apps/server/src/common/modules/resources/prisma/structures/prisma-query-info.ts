export interface PrismaQueryInfo
  {
	 /**
	  * The queried prisma model.
	  */
	 model : string;
	 /**
	  * The performed action on the model e.g. `create`, `findUnique`.
	  */
	 action : string;
	 /**
	  * Time `Date.now()` before the query execution.
	  *
	  */
	 before : number;
	 /**
	  * Time `Date.now()` after the query execution.
	  */
	 after : number;
	 /**
	  * Execution time of the query in milliseconds.
	  */
	 executionTime : number;
  }