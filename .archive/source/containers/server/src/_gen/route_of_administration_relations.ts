// @ts-nocheck

import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Dosage}                           from './dosage.js';
import {Phase}                            from './phase.js';
import {Substance}                        from './substance.js';



export class RouteOfAdministrationRelations {
	@ApiProperty({
		isArray: true,
		type:    () => Dosage,
	}) dosage: Dosage[];

	@ApiProperty({
		isArray: true,
		type:    () => Phase,
	}) phases: Phase[];

	@ApiPropertyOptional({type: () => Substance}) Substance?: Substance;
}
