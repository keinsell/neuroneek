import {ApiProperty}           from '@nestjs/swagger';
import {Ingestion}             from './ingestion.js';
import {RouteOfAdministration} from './route_of_administration.js';
import {Stash}                 from './stash.js';
import {SubstanceInteraction}  from './substance_interaction.js';



export class SubstanceRelations {
	@ApiProperty({
		isArray: true,
		type:    () => RouteOfAdministration,
	}) routes_of_administration: RouteOfAdministration[];

	@ApiProperty({
		isArray: true,
		type:    () => Ingestion,
	}) Ingestion: Ingestion[];

	@ApiProperty({
		isArray: true,
		type:    () => Stash,
	}) Stash: Stash[];

	@ApiProperty({
		isArray: true,
		type:    () => SubstanceInteraction,
	}) SubstanceInteraction: SubstanceInteraction[];
}
