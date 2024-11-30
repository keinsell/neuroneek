import {ApiPropertyOptional} from '@nestjs/swagger';
import {Stash}               from './stash.js';
import {Subject}             from './subject.js';
import {Substance}           from './substance.js';



export class IngestionRelations {
	@ApiPropertyOptional({type: () => Subject}) Subject?: Subject;

	@ApiPropertyOptional({type: () => Substance}) Substance?: Substance;

	@ApiPropertyOptional({type: () => Stash}) Stash?: Stash;
}
