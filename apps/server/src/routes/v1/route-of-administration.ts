// @ts-nocheck

import {Controller, Get, Logger, Param, Query}  from "@nestjs/common"
import {ApiOperation, ApiProperty, ApiResponse} from "@nestjs/swagger"
import {Prisma, RouteOfAdministration}          from "db"
import {HttpProblem}                            from "../../common/error/problem-details/http-problem.js"
import {HttpStatus}                             from "../../common/http-status.js"
import {PrismaService}                          from "../../core/modules/database/prisma/services/prisma-service.js"



export class RouteOfAdministrationModel {
	@ApiProperty({
		description: 'The ID of the route of administration',
		example:     'clvdzrfzj0000f2ftr6cm3fjr',
	}) public id: string

	name: string


	static fromRouteOfAdministration(routeOfAdministration: RouteOfAdministration): RouteOfAdministrationModel {
		return {
			id:   routeOfAdministration.id,
			name: routeOfAdministration.name,
		}

	}
}


export class RouteOfAdministrationNotFound extends HttpProblem {
	constructor(routeId: string) {
		super({
			instance: `com.app.route-of-administration.${routeId}`,
			type:     "com.app.route-of-administration.not-found",
			status:   HttpStatus.NOT_FOUND,
			title:    "Route of Administration not found",
			message:  `Route of Administration with ID ${routeId} not found`,
		})
	}
}


@Controller("route-of-administration")
export class RouteOfAdministrationController {
	private logger = new Logger("controller:route-of-administration")


	constructor(private readonly prismaService: PrismaService) {
	}


	@Get(":id") @ApiOperation({
		operationId: "get-route-of-administration-by-id",
		summary:     "Get Route of Administration by ID",
		description: "Returns a Route of Administration by its ID.",
	}) @ApiResponse({
		status:      200,
		description: "Route of Administration found",
		type:        RouteOfAdministrationModel,
	})
	async getRouteOfAdministrationById(@Param("id") idParameter: unknown, @Query("include") includeParameter: unknown | ("dosage" | "phase")[]): Promise<RouteOfAdministrationModel> {
		// Validate input param to be a string
		if (typeof idParameter !== "string") {
			throw new Error("Invalid input")
		}

		// If include parameter is not provided, default to not including dosage and phase
		const include = includeParameter ?? []

		this.logger.debug(`Fetching route of administration by ID: ${idParameter}`)

		// Fetch Route of Administration by ID
		const routeOfAdministration = await this.prismaService.routeOfAdministration.findUnique({
			where: {
				id: idParameter,
			},
		})

		if (!routeOfAdministration) {
			throw new RouteOfAdministrationNotFound(idParameter)
		}

		this.logger.debug(`Found route of administration: ${JSON.stringify(routeOfAdministration)}`)

		return RouteOfAdministrationModel.fromRouteOfAdministration(routeOfAdministration)
	}


	@Get() @ApiOperation({
		operationId: "list-routes-of-administration",
		summary:     "List Routes of Administration",
		description: "Returns all Route of Administrations.",
	}) @ApiResponse({
		status:      200,
		description: "Route of Administrations found",
		type:        [RouteOfAdministrationModel],
	})
	async getAllRouteOfAdministrations(@Query("include") includeParameter: ("dosage" | "phase")[], @Query("limit") limitParameter: number, @Query("offset") offsetParameter: number, @Query("sort") sortParameter: string, @Query("where") whereParameter: {
		substance?: { name?: string }
	}): Promise<RouteOfAdministrationModel[]> {

		this.logger.debug(`Fetching all route of administrations`)

		// Define query parameters as Prisma options
		const prismaOptions: Prisma.RouteOfAdministrationFindManyArgs = {};

		if (limitParameter) {
			prismaOptions.take = limitParameter;
		}

		if (offsetParameter) {
			prismaOptions.skip = offsetParameter;
		}

		if (sortParameter) {
			prismaOptions.orderBy = {
				[sortParameter.split(':')[0]]: sortParameter.split(':')[1].toUpperCase(),
			}
		}

		if (whereParameter && whereParameter?.substance && whereParameter?.substance?.name) {
			prismaOptions.where = {
				substanceName: whereParameter.substance.name,
			}
		}

		if (includeParameter) {
			if (typeof includeParameter === "object") {
				prismaOptions.include = {};
				if (includeParameter.includes("dosage")) {
					prismaOptions.include.dosage = true;
				}
				if (includeParameter.includes("phase")) {
					prismaOptions.include.phases = true;
				}
			}
		}

		// Fetch all Route of Administrations
		const routeOfAdministrations = await this.prismaService.routeOfAdministration.findMany(prismaOptions)

		return routeOfAdministrations.map(route => RouteOfAdministrationModel.fromRouteOfAdministration(route));
	}
}