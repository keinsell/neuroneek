// @ts-nocheck

import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';



export class RouteOfAdministration {
  @ApiProperty({ type: String })
  id: string;

  @ApiPropertyOptional({ type: String })
  substanceName?: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  bioavailability: number;
}
