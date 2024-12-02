// @ts-nocheck

import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Account}                          from './account.js';
import {Ingestion}                        from './ingestion.js';
import {Stash}                            from './stash.js';



export class SubjectRelations {
	@ApiPropertyOptional({type: () => Account}) account?: Account;

	@ApiProperty({
		isArray: true,
		type:    () => Ingestion,
	}) Ingestions: Ingestion[];

	@ApiProperty({
		isArray: true,
		type:    () => Stash,
	}) Stash: Stash[];
}
