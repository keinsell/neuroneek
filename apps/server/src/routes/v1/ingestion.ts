// Main controller for building ingestion routes.

import {Body, Controller, Post} from "@nestjs/common";
import {ApiBearerAuth, ApiOkResponse, ApiOperation, ApiProperty, ApiTags} from "@nestjs/swagger";
import {RouteOfAdministrationClassification} from "@neuronek/osiris"
import {Ingestion} from "../../_gen/ingestion";

export class CreateIngestion
    {
        @ApiProperty({
                         description: "Identifier of the substance, that was ingested. Custom substances will be supported in future but actually we're sticking to database information."
                     })
        substanceId!: string

        @ApiProperty({
                         description: "Date of ingestion.",
                         type       : Date,
                         example    : "2024-05-04T18:34:01.253Z",
                     }) ingestionDate!: Date
        // Enum value
        @ApiProperty({
                         description: "Route of administration for the substance.",
                         enum       : RouteOfAdministrationClassification,
                         example    : RouteOfAdministrationClassification.oral
                     }) routeOfAdministration!: RouteOfAdministrationClassification
    }

export class IngestionCreated {}

@ApiTags("Ingestion Journal")

@Controller("ingestion")
export class IngestionController
    {


        @ApiBearerAuth()
        @ApiOperation({
                          summary    : "Create ingestion",
                          description: "Create ingestion for a subject.",
                          operationId: "create-ingestion"
                      })
        @ApiOkResponse({
                           type       : Ingestion,
                           description: "Ingestion created."
                       })
        @Post()
        async createIngestion(@Body() createIngestion: CreateIngestion): Promise<Ingestion>
            {
                throw new Error("Not implemented")
            }
    }