import type { SetOptional } from 'type-fest'
import { Message }          from './message.js'
import { MessageType }      from './values/message-type.js'



export class Event<BODY = unknown>
  extends Message<BODY>
  {
	 override type : MessageType = MessageType.EVENT


	 constructor(payload : SetOptional<Message<BODY>, 'id' | 'timestamp' | 'type' | 'namespace'>)
		{
		  super( {
					  ...payload,
					} )
		  this.id = this.generateIdWithNamespace( this.type )
		}
  }