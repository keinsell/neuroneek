// Main controller for building ingestion routes.

import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { RouteOfAdministrationClassification } from '@neuronek/osiris';
import { Ingestion } from '../../_gen/ingestion';
import { PrismaService } from '../../core/modules/database/prisma/services/prisma-service';
import { SubstanceNotFound } from './substance';
import { Prisma } from '@neuronek/db/generated/prisma-client';

export class CreateIngestion {
  @ApiProperty({
    description:
      "Identifier of the substance, that was ingested. Custom substances will be supported in future but actually we're sticking to database information.",
    example: 'clvdzrg000003f2ftwlzzelog',
  })
  substanceId!: string;

  @ApiProperty({
    description: 'Date of ingestion.',
    type: Date,
    example: '2024-05-04T18:34:01.253Z',
  })
  ingestionDate!: Date;
  // Enum value
  @ApiProperty({
    description: 'Route of administration for the substance.',
    enum: RouteOfAdministrationClassification,
    example: RouteOfAdministrationClassification.oral,
  })
  routeOfAdministration!: RouteOfAdministrationClassification;

  @ApiProperty({
    description: 'Dosage amount.',
    example: 10,
  })
  dosageAmont!: number;

  @ApiProperty({
    description: 'Unit of the dosage amount.',
    example: 'mg',
  })
  dosageUnit!: string;

  @ApiProperty({
    description: 'If the dosage is estimated.',
    default: false,
    example: false,
  })
  dosageEstimated?: boolean;

  @ApiProperty({
    description:
      'If the dosage is estimated, this is the standard deviation of the estimation. This is amount of unit choosen in dosageUnit.',
    example: 0.5,
  })
  /** If the dosage is estimated, this is the standard deviation of the estimation. */
  dosageEstimationStandardDeviation?: number;
}

@ApiTags('Ingestion Journal')
@Controller('ingestion')
export class IngestionController {
  constructor(private prismaService: PrismaService) { }

  @ApiBearerAuth()
  @ApiOperation({
    summary: '[WIP] Create ingestion',
    description: 'Create ingestion for a subject.',
    operationId: 'create-ingestion',
  })
  @ApiOkResponse({
    type: Ingestion,
    description: 'Ingestion created.',
  })
  @Post()
  async createIngestion(
    @Body() createIngestion: CreateIngestion,
  ): Promise<Ingestion> {
    // 1. Find the substance by ID
    const substance = await this.prismaService.substance.findUnique({
      where: { id: createIngestion.substanceId },
    });

    if (!substance) {
      throw new SubstanceNotFound();
    }

    // 2. Create the ingestion
    const createIngestionEntry: Prisma.IngestionCreateInput = {
      date: createIngestion.ingestionDate,
      isEstimatedDosage: false,
      routeOfAdministration: createIngestion.routeOfAdministration,
      dosage_amount: createIngestion.dosageAmont,
      dosage_unit: createIngestion.dosageUnit,
      Substance: {
        connect: {
          id: substance.id,
        },
      },
    };

    const ingestion = await this.prismaService.ingestion.create({
      data: createIngestionEntry,
    });

    return ingestion as any;
  }
}
