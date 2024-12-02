// An main controller for quering substance information.

import { TypedParam } from "@nestia/core"
import { Controller, Get, Logger, NotFoundException } from "@nestjs/common"
import { ApiOperation, ApiParam, ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger"
import { Substance } from "db"
import { PrismaService } from "../../core/modules/database/prisma/services/prisma-service.js"
import { ApiModel } from "../../utilities/docs-utils/swagger-api-model.js"
import { RouteOfAdministration } from "../../_gen/route_of_administration"
import { SubstanceWithRouteOfAdministrationWithDosage } from "../../core/modules/database/prisma/prisma.js"


@ApiModel({ name: "Substance" })
export class SubstanceResponse {
  @ApiProperty({
    description: 'The ID of the substance',
    example: 'clvdzrfzj0000f2ftr6cm3fjr',
  }) public id: string
  @ApiProperty({
    description: 'The name of the substance',
    example: '1,3-dimethylbutylamine',
  }) public name: string
  @ApiProperty({
    description: 'Common names of the substance',
    example: ['1,3-dimethylbutylamine', '1,4-Butanediol', '1P-ETH-LAD'],
  }) public common_names: string[]
  @ApiProperty({
    description: "Psychoactive Classes to which substance belong",
    example: ['Stimulants', 'Depressant', 'Psychedelic'],
  }) public psychoactive_classes: string[]
  @ApiProperty({
    description: "Chemical Classes to which substance belong",
    example: ['Amine', 'Alkanediol,Diol', 'Lysergamides'],
  }) public chemical_classes: string[]

  @ApiProperty({
    description: "Routes of administration that are known for the substance.",
    type: [RouteOfAdministration],
    nullable: true,
  }) public routes_of_administration: RouteOfAdministration[] | null

  constructor(
    properties: {
      id: string,
      name: string,
      common_names: string[],
      psychoactive_classes: string[],
      chemical_classes: string[],
      routes_of_administration: RouteOfAdministration[] | null,
    }
  ) {
    this.id = properties.id
    this.name = properties.name
    this.common_names = properties.common_names
    this.psychoactive_classes = properties.psychoactive_classes
    this.chemical_classes = properties.chemical_classes
    this.routes_of_administration = properties.routes_of_administration
  }


  static fromSubstance(substance: SubstanceWithRouteOfAdministrationWithDosage): SubstanceResponse {
    return {
      id: substance.id,
      name: substance.name,
      common_names: substance?.common_names?.split(',') ?? [],
      psychoactive_classes: substance.psychoactive_class.split(','),
      chemical_classes: substance?.chemical_class?.split(',') ?? [],
      routes_of_administration: substance.routes_of_administration as never,
    }
  }
}

export class SubstanceNotFound
  extends NotFoundException {


  static get because() {
    return {
      notFoundInDatabase: () => new SubstanceNotFound("Substance not found"),
    }
  }
}


@ApiTags("Substance Warehouse")
@Controller('substance')
export class SubstanceController {
  private logger = new Logger('controller:substance')

  constructor(private readonly prismaService: PrismaService) { }


  @ApiResponse({
    status: 200,
    type: SubstanceResponse,
  }) @Get("/:substanceId") @ApiOperation(
    {
      summary: "Get Substance By ID",
      description: `Get substance by ID or throw 404 if not found.`,
      operationId: "get-substance-by-id"
    })
  @ApiParam({
    name: 'substanceId',
    description: 'The ID of the substance',
    required: true,
    example: 'clvdzrfzj0000f2ftr6cm3fjr',
  })
  async getSubstanceById(@TypedParam('substanceId') id: string): Promise<SubstanceResponse> {
    this.logger.debug(`Fetching substance by id: ${id}`)
    // Validate input param to be a string
    if (typeof id !== 'string') {
      throw new Error("Invalid input")
    }

    // Fetch substance by id
    const substance = await this.prismaService.substance.findUnique({
      where: { id: id },
      include: {
        routes_of_administration: {
          include: {
            dosage: true
          }
        }
      }
    })

    this.logger.debug(`Found substance: ${JSON.stringify(substance)}`)

    if (!substance) {
      throw SubstanceNotFound.because.notFoundInDatabase()
    }

    // Return substance
    return SubstanceResponse.fromSubstance(substance)
  }


  @ApiOperation({
    summary: "Get All Substances",
    description: "Get all substances from the database.",
    operationId: "get-all-substances",
  })
  @ApiResponse({
    status: 200,
    type: [SubstanceResponse],
  }) @Get()
  async getAllSubstances() {
    const substances = await this.prismaService.substance.findMany({ include: { routes_of_administration: { include: { dosage: true } } } })
    this.logger.debug(`Found ${substances.length} substances`)
    return substances.map(SubstanceResponse.fromSubstance)
  }
}
