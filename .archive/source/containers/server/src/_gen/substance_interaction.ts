// @ts-nocheck

import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';



export class SubstanceInteraction {
  @ApiProperty({ type: String })
  id: string;

  @ApiPropertyOptional({ type: String })
  substanceId?: string;
}
