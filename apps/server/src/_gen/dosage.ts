import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Dosage {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  intensivity: string;

  @ApiProperty({ type: Number })
  amount_min: number;

  @ApiProperty({ type: Number })
  amount_max: number;

  @ApiProperty({ type: String })
  unit: string;

  @ApiProperty({ type: Boolean })
  perKilogram: boolean;

  @ApiPropertyOptional({ type: String })
  routeOfAdministrationId?: string;
}
