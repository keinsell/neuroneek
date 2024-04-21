import { Logger }           from '@nestjs/common'
import { ApplicationState } from '../../state.js'



export abstract class SeederBase<INPUT = unknown>
  {
	 private logger : Logger        = new Logger( 'seeder' )
	 private inputStorage : INPUT[] = []
	 private limit : number         = 10


	 protected constructor(logger : Logger)
		{
		  this.logger = logger
		}


	 async seed() : Promise<void>
		{

		  let retryTime = 1000

		  while ( !ApplicationState.isDatabaseConnected )
			 {
				this.logger.verbose( `🌱 Waiting for database connection...` )
				retryTime = Math.min( retryTime * 2, 10000 )
				await new Promise( resolve => setTimeout( resolve, retryTime ) )
			 }

		  if ( await this.isEnough() )
			 {
				this.logger.verbose( `🌱 Seedling is already enough. Skipping.` )
				return
			 }

		  // If no dataset was provided then we fabricate
		  if ( this.inputStorage.length === 0 )
			 {
				// Fabricate entities
				for ( let i = 0; i < this.limit; i++ )
				  {
					 const input = await this.fabricate()
					 this.inputStorage.push( input )
				  }
			 }

		  // Save entities
		  for ( const input of this.inputStorage )
			 {
				const exists = await this.exists( input )

				if ( !exists )
				  {
					 this.preSaveHook( input )

					 try
						{
						  const created = await this.save( input )
						  this.postSaveHook( created )
						}
					 catch ( e )
						{
						  this.saveFailedHook( input, e )
						}
				  }
				else
				  {
					 this.postExistsHook( input )
				  }
			 }
		}


	 public provideDataset(dataset : INPUT[]) : void
		{
		  this.inputStorage = dataset
		}


	 abstract fabricate() : Promise<INPUT>


	 public setCustomLimit(limit : number) : void
		{
		  this.limit = limit
		}


	 abstract exists(input : INPUT) : Promise<boolean>


	 abstract save(input : INPUT) : Promise<unknown>


	 abstract count() : Promise<number>


	 private postSaveHook(entity : unknown) : void
		{
		  this.logger.verbose( `🌱 Successfully created a new seedling in database: ${JSON.stringify( entity )}` )
		}


	 private preSaveHook(input : INPUT) : void
		{
		  this.logger.verbose( `🌱 Creating a new seedling in database: ${JSON.stringify( input )}` )
		}


	 private saveFailedHook(
		input : INPUT,
		e : unknown,
	 ) : void
		{
		  this.logger.verbose( `❌ Failed to create a new seedling in database.` )
		  this.logger.verbose( `❌ Input: ${JSON.stringify( input )}` )
		  this.logger.verbose( `❌ Error: ${JSON.stringify( e )}` )
		}


	 private postExistsHook(input : INPUT) : void
		{
		  this.logger.verbose( `🌱 Seedling already exists in database: ${JSON.stringify( input )}. Skipping.` )
		}


	 private async isEnough() : Promise<boolean>
		{
		  const count = await this.count()

		  const isCustomDataset = this.inputStorage.length > 0

		  // Should run if there's a custom dataset or if fabricated entities are not enough
		  return !isCustomDataset && count >= this.limit
		}
  }