import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Phase {
  @ApiProperty({ type: String })
  id: string;

  @ApiPropertyOptional({ type: Number })
  from?: number;

  @ApiPropertyOptional({ type: Number })
  to?: number;

  @ApiPropertyOptional({ type: String })
  routeOfAdministrationId?: string;
}
