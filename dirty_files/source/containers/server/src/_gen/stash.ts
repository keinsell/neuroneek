// @ts-nocheck

import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';



export class Stash {
	@ApiProperty({type: String}) id: string;

	@ApiProperty({type: String}) owner_id: string;

	@ApiProperty({type: String}) substance_id: string;

	@ApiPropertyOptional({type: Date}) addedDate?: Date;

	@ApiPropertyOptional({type: Date}) expiration?: Date;

	@ApiPropertyOptional({type: Number}) amount?: number;

	@ApiPropertyOptional({type: String}) price?: string;

	@ApiPropertyOptional({type: String}) vendor?: string;

	@ApiPropertyOptional({type: String}) description?: string;

	@ApiPropertyOptional({type: Number}) purity?: number = 100;
}
