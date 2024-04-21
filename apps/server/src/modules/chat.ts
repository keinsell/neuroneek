import {ApiProperty}                      from '@nestjs/swagger'
import {UniqueIdentifierApiSpecification} from '../common/libraries/identification/index.js'



class ChatChannel
{
	@ApiProperty(UniqueIdentifierApiSpecification) id: string
	ownerId: string
	members: string[]
}


class ChatMember
{
	@ApiProperty(UniqueIdentifierApiSpecification) id: string
	userId: string
	channelId: string
}


export class ChatMessage
{
	@ApiProperty(UniqueIdentifierApiSpecification) id: string
	sender_id: string
	createdAt: Date
	updatedAt: Date
}


class ChatAttachment
{
	@ApiProperty(UniqueIdentifierApiSpecification) id: string
}
