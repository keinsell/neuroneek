import {ApiPropertyOptional}   from '@nestjs/swagger';
import {RouteOfAdministration} from './route_of_administration.js';



export class DosageRelations {
	@ApiPropertyOptional({type: () => RouteOfAdministration}) RouteOfAdministration?: RouteOfAdministration;
}
