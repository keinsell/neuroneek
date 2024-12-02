import { Message }     from './message.js'
import { MessageType } from './values/message-type.js'



export class Command
  extends Message
  {
	 type : MessageType = MessageType.COMMAND
  }