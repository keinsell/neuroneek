// @ts-nocheck

import {ApiProperty} from '@nestjs/swagger';
import {Phase}       from './phase.js';



export class EffectRelations {
	@ApiProperty({
		isArray: true,
		type:    () => Phase,
	}) Phase: Phase[];
}
