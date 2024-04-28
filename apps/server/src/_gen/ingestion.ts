import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Ingestion {
  @ApiProperty({ type: String })
  id: string;

  @ApiPropertyOptional({ type: String })
  substanceName?: string;

  @ApiPropertyOptional({ type: String })
  routeOfAdministration?: string;

  @ApiPropertyOptional({ type: String })
  dosage_unit?: string;

  @ApiPropertyOptional({ type: Number })
  dosage_amount?: number;

  @ApiPropertyOptional({ type: Boolean })
  isEstimatedDosage?: boolean;

  @ApiPropertyOptional({ type: Date })
  date?: Date;

  @ApiPropertyOptional({ type: String })
  subject_id?: string;

  @ApiPropertyOptional({ type: String })
  stashId?: string;
}
