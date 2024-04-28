import {ApiPropertyOptional} from '@nestjs/swagger';
import {Substance}           from './substance.js';



export class SubstanceInteractionRelations {
	@ApiPropertyOptional({type: () => Substance}) Substance?: Substance;
}
