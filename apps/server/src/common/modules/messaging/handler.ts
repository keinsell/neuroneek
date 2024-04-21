import { Logger }  from '@nestjs/common'
import { Message } from '../../libraries/message/message.js'



export abstract class HandlerBase<T extends Message>
  {
	 protected logger : Logger = new Logger( this.constructor.name )


	 constructor(logger : Logger)
		{
		  this.logger = logger
		}


	 abstract execute(message : T) : Promise<void>


	 public async handleAll(messages : T[])
		{
		  for ( const message of messages )
			 {
				await this.handle( message )
			 }
		}


	 public async handle(message : T) : Promise<void>
		{
		  await this.preHandle( message )
		  try
			 {
				const result = await this.execute( message )
				await this.postHandle( message, result )
			 }
		  catch ( error )
			 {
				this.logger.error( `Message ${message.constructor.name} with id ${message.id} has failed to be handled` )
				this.logger.error( `Message payload: ${JSON.stringify( message )}` )
				this.logger.error( `Error: ${JSON.stringify( error )}` )
				throw error
			 }
		}


	 public async postHandle(
		message : T,
		result? : unknown,
	 ) : Promise<void>
		{
		  this.logger.verbose( `Message ${message.constructor.name} with id ${message.id} has been handled` )
		  this.logger.verbose( `Message result: ${JSON.stringify( result )}` )
		}


	 private async preHandle(message : T) : Promise<void>
		{
		  this.logger.verbose( `Handling message ${message.constructor.name} with id ${message.id}` )
		  this.logger.verbose( `Message payload: ${JSON.stringify( message )}` )
		}
  }