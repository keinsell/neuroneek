import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Effect {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  slug: string;

  @ApiPropertyOptional({ type: String })
  category?: string;

  @ApiPropertyOptional({ type: String })
  type?: string;

  @ApiProperty({ type: String })
  tags: string;

  @ApiPropertyOptional({ type: String })
  summary?: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  parameters: string;

  @ApiProperty({ type: String })
  see_also: string;

  @ApiPropertyOptional({ type: String })
  effectindex?: string;

  @ApiPropertyOptional({ type: String })
  psychonautwiki?: string;
}
