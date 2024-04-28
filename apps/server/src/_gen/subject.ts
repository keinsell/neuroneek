import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Subject {
  @ApiProperty({ type: String })
  id: string;

  @ApiPropertyOptional({ type: String })
  firstName?: string;

  @ApiPropertyOptional({ type: String })
  lastName?: string;

  @ApiPropertyOptional({ type: Date })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ type: Number })
  weight?: number;

  @ApiPropertyOptional({ type: Number })
  height?: number;

  @ApiPropertyOptional({ type: String })
  account_id?: string;
}
