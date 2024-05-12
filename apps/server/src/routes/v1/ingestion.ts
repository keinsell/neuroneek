// Main controller for building ingestion routes.

import {Body, Controller, Get, Post, UseGuards, Patch} from '@nestjs/common';
import {
	ApiBearerAuth, ApiOkResponse, ApiOperation, ApiProperty, ApiTags, PartialType,
}                                                      from '@nestjs/swagger';
import {RouteOfAdministrationClassification}           from '@neuronek/osiris';
import {Ingestion}                                     from '../../_gen/ingestion';
import {PrismaService}                                 from '../../core/modules/database/prisma/services/prisma-service';
import {SubstanceNotFound}                             from './substance';
import {Account, Prisma}                               from '@neuronek/db/generated/prisma-client';
import {GetUser}                                       from '../../core/identity/authn/jwt-authentication-strategy';
import {JwtAuthorizationGuard}                         from '../../core/identity/authn/components/guards/jwt-authorization-guard';



export class CreateIngestion {
	@ApiProperty({
		description: "Identifier of the substance, that was ingested. Custom substances will be supported in future but actually we're sticking to database information.",
		example:     'clvdzrg000003f2ftwlzzelog',
	}) substanceId!: string;

	@ApiProperty({
		description: 'Date of ingestion.',
		type:        Date,
		example:     '2024-05-04T18:34:01.253Z',
	}) ingestionDate!: Date;
	// Enum value
	@ApiProperty({
		description: 'Route of administration for the substance.',
		enum:        RouteOfAdministrationClassification,
		example:     RouteOfAdministrationClassification.oral,
	}) routeOfAdministration!: RouteOfAdministrationClassification;

	@ApiProperty({
		description: 'Dosage amount.',
		example:     10,
	}) dosageAmont!: number;

	@ApiProperty({
		description: 'Unit of the dosage amount.',
		example:     'mg',
	}) dosageUnit!: string;

	@ApiProperty({
		description: 'If the dosage is estimated.',
		default:     false,
		example:     false,
	}) dosageEstimated?: boolean;

	@ApiProperty({
		description: 'If the dosage is estimated, this is the standard deviation of the estimation. This is amount of unit choosen in dosageUnit.',
		example:     0.5,
	}) /** If the dosage is estimated, this is the standard deviation of the estimation. */
	   dosageEstimationStandardDeviation?: number;

	@ApiProperty({
		description: 'Identifier of the subject that ingested the substance.',
		example:     'clvdzrg000003f2ftwlzzelog',
		required:    true,
	}) subjectId!: string;
}


export class UpdateIngestion extends PartialType(CreateIngestion) {}


@ApiTags('Ingestion Journal') @Controller('ingestion')
export class IngestionController {
	constructor(private prismaService: PrismaService) { }


	@ApiBearerAuth() @ApiOperation({
		summary:     '🚧 Create ingestion',
		description: 'Create ingestion for a subject.',
		operationId: 'create-ingestion',
	}) @ApiOkResponse({
		type:        Ingestion,
		description: 'Ingestion created.',
	}) @Post()
	async createIngestion(@Body() createIngestion: CreateIngestion): Promise<Ingestion> {
		// 1. Find the substance by ID
		const substance = await this.prismaService.substance.findUnique({
			where: {id: createIngestion.substanceId},
		});

		if (!substance) {
			throw new SubstanceNotFound();
		}

		// 2. Create the ingestion
		const createIngestionEntry: Prisma.IngestionCreateInput = {
			date:                  createIngestion.ingestionDate,
			isEstimatedDosage:     false,
			routeOfAdministration: createIngestion.routeOfAdministration,
			dosage_amount:         createIngestion.dosageAmont,
			dosage_unit:           createIngestion.dosageUnit,
			Substance:             {
				connect: {
					id: substance.id,
				},
			},
			Subject:               {
				connect: {
					id: createIngestion.subjectId,
				},
			},
		};

		const ingestion = await this.prismaService.ingestion.create({
			data: createIngestionEntry as any,
		});

		return ingestion as any;
	}


	@ApiBearerAuth() @ApiOperation({
		summary:     '🚧 Update ingestion',
		description: 'Update ingestion for a subject.',
		operationId: 'update-ingestion',
	}) @ApiOkResponse({
		type:        Ingestion,
		description: 'Ingestion updated.',
	}) @Patch()
	async updateIngestion(@Body() updateIngestion: UpdateIngestion): Promise<Ingestion> {
		return null as any;
	}


	@ApiBearerAuth() @UseGuards(JwtAuthorizationGuard) @ApiOperation({
		summary:     '🚧 List ingestions',
		description: 'List ingestions for a subject.',
		operationId: 'list-ingestions',
	}) @ApiOkResponse({
		type:        Ingestion,
		description: 'Ingestions listed.',
	}) @Get()
	async listIngestions(@GetUser() user: Account): Promise<Ingestion[]> {
		// 1. Find the substance by ID
		const ingestions = await this.prismaService.ingestion.findMany({where: {Subject: {account_id: user.id}}});

		return ingestions as any;
	}
}
