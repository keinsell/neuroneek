import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Ingestion}                        from './ingestion.js';
import {Subject}                          from './subject.js';
import {Substance}                        from './substance.js';



export class StashRelations {
	@ApiPropertyOptional({type: () => Subject}) Subject?: Subject;

	@ApiProperty({type: () => Substance}) Substance: Substance;

	@ApiProperty({
		isArray: true,
		type:    () => Ingestion,
	}) ingestions: Ingestion[];
}
