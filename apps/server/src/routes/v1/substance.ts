// An main controller for quering substance information.

import {TypedParam}                                 from "@nestia/core"
import {Controller, Get, Logger, NotFoundException} from "@nestjs/common"
import {ApiOperation, ApiProperty, ApiResponse}     from "@nestjs/swagger"
import {string}                                     from "fp-ts"
import {PrismaService}                              from "../../core/modules/database/prisma/services/prisma-service.js"



export class SubstanceResponse {
	@ApiProperty({type: string}) id: string
}


@Controller('substance')
export class SubstanceController {
	private logger = new Logger('controller:substance')


	constructor(private readonly prismaService: PrismaService) {}


	@ApiResponse({
		status: 200,
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
		return substance
	}


	@Get()
	async getAllSubstances() {
		const substances = await this.prismaService.substance.findMany()
		this.logger.debug(`Found ${substances.length} substances`)
		return substances
	}
}
