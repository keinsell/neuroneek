import { Injectable } from '@nestjs/common'
import { SeederBase } from '../seeder-base.js'



@Injectable()
export class SeederService
  {
	 constructor(private readonly seeders : SeederBase[]) {}


	 async run() : Promise<any>
		{
		  return this.seed()
		}


	 async seed() : Promise<any>
		{
		  // Don't use `Promise.all` during insertion.
		  // `Promise.all` will run all promises in parallel which is not what we want.
		  for ( const seeder of this.seeders )
			 {
				await seeder.seed()
			 }
		}
  }