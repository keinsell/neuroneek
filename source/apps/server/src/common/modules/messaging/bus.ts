import { EventEmitter } from 'events'
import { Message }      from '../../libraries/message/message.js'


// TODO: https://linear.app/keinsell/issue/PROD-108/add-outbox-support-for-message-bus
/** Message Bus is abstraction that will use in-memory registrations based on the message type, serialization logic and decorators. This is one-stop place to publish events to other parts of application. */
export abstract class Bus
  {
	 constructor() {}


	 abstract publish(message : Message) : Promise<void>


	 async publishAll(messages : Message[])
		{
		  for ( const message of messages )
			 {
				await this.publish( message )
			 }
		}
  }


export class EventEmitterBus
  extends Bus
  {
	 private emitter : EventEmitter = new EventEmitter()


	 constructor()
		{
		  super()
		}


	 public async publish(message : Message) : Promise<void>
		{
		  this.emitter.emit( message.constructor.name, message )
		}
  }