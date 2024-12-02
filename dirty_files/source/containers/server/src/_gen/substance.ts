// @ts-nocheck

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';



export class Substance {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String, description: "Common names are informal names for chemical compounds that are widely used in everyday language, but not necessarily scientifically accurate or consistent. They often reflect the historical or common usage of a compound, rather than its chemical structure or composition." })
  common_names?: string;

  @ApiPropertyOptional({ type: String })
  brand_names?: string;

  @ApiPropertyOptional({ type: String })
  substitutive_name?: string;

  @ApiPropertyOptional({ type: String })
  systematic_name?: string;

  @ApiPropertyOptional({ type: String })
  unii?: string;

  @ApiPropertyOptional({ type: String })
  cas_number?: string;

  @ApiPropertyOptional({ type: String })
  inchi_key?: string;

  @ApiPropertyOptional({ type: String })
  iupac?: string;

  @ApiPropertyOptional({ type: String })
  smiles?: string;

  @ApiProperty({ type: String })
  psychoactive_class: string;

  @ApiPropertyOptional({ type: String })
  chemical_class?: string;

  @ApiPropertyOptional({ type: String })
  description?: string;
}
