import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {Effect}                           from './effect.js';
import {RouteOfAdministration}            from './route_of_administration.js';



export class PhaseRelations {
	@ApiPropertyOptional({type: () => RouteOfAdministration}) RouteOfAdministration?: RouteOfAdministration;

	@ApiProperty({
		isArray: true,
		type:    () => Effect,
	}) effects: Effect[];
}
