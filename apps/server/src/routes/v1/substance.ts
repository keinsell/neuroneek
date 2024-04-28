// An main controller for quering substance information.

import {TypedParam}                                 from "@nestia/core"
import {Controller, Get, Logger, NotFoundException} from "@nestjs/common"
import {ApiOperation, ApiProperty, ApiResponse}     from "@nestjs/swagger"
import {Substance}                                  from "db"
import {PrismaService}                              from "../../core/modules/database/prisma/services/prisma-service.js"
import {ApiModel}                                   from "../../utilities/docs-utils/swagger-api-model.js"



@ApiModel({name: "Substance"})
export class SubstanceResponse {
	@ApiProperty({
		description: 'The ID of the substance',
		example:     'clvdzrfzj0000f2ftr6cm3fjr',
	}) public id: string
	@ApiProperty({
		description: 'The name of the substance',
		example:     '1,3-dimethylbutylamine',
	}) public name: string
	@ApiProperty({
		description: 'Common names of the substance',
		example:     ['1,3-dimethylbutylamine', '1,4-Butanediol', '1P-ETH-LAD'],
	}) public common_names: string[]
	@ApiProperty({
		description: "Psychoactive Classes to which substance belong",
		example:     ['Stimulants', 'Depressant', 'Psychedelic'],
	}) public psychoactive_classes: string[]
	@ApiProperty({
		description: "Chemical Classes to which substance belong",
		example:     ['Amine', 'Alkanediol,Diol', 'Lysergamides'],
	}) public chemical_classes: string[]


	static fromSubstance(substance: Substance): SubstanceResponse {
		return {
			id:                   substance.id,
			name:                 substance.name,
			common_names:         substance?.common_names?.split(',') ?? [],
			psychoactive_classes: substance.psychoactive_class.split(','),
			chemical_classes:     substance?.chemical_class?.split(',') ?? [],
		}
	}
}


@Controller('substance')
export class SubstanceController {
	private logger = new Logger('controller:substance')


	constructor(private readonly prismaService: PrismaService) {}


	@ApiResponse({
		status: 200,
		type:   SubstanceResponse,
	}) @Get(":id") @ApiOperation({summary: "Get substance by id"})
	async getSubstanceById(@TypedParam('id') id: string): Promise<SubstanceResponse> {
		this.logger.debug(`Fetching substance by id: ${id}`)
		// Validate input param to be a string
		if (typeof id !== 'string') {
			throw new Error("Invalid input")
		}

		// Fetch substance by id
		const substance = await this.prismaService.substance.findUnique({
			where: {id: id},
		})

		this.logger.debug(`Found substance: ${JSON.stringify(substance)}`)

		if (!substance) {
			throw new NotFoundException("Substance not found")
		}

		// Return substance
		return SubstanceResponse.fromSubstance(substance)
	}


	@ApiResponse({
		status: 200,
		type:   [SubstanceResponse],
	}) @Get()
	async getAllSubstances() {
		const substances = await this.prismaService.substance.findMany()
		this.logger.debug(`Found ${substances.length} substances`)
		return substances.map(SubstanceResponse.fromSubstance)
	}
}
