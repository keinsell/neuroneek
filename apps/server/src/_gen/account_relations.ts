import {ApiProperty} from '@nestjs/swagger';
import {Subject}     from './subject.js';



export class AccountRelations {
	@ApiProperty({
		isArray: true,
		type:    () => Subject,
	}) Subject: Subject[];
}
