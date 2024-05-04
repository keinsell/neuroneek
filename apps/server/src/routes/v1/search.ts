// An main controller for quering substance information.

import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    OnApplicationBootstrap,
    Query
} from "@nestjs/common"
import {ApiOperation, ApiProperty, ApiQuery, ApiResponse, ApiTags} from "@nestjs/swagger"
import {create, insert, Orama, search, TypedDocument} from '@orama/orama'
import {Substance} from "db"
import {PrismaService} from "../../core/modules/database/prisma/services/prisma-service.js"

export class TimeMeasurement
    {
        @ApiProperty({example: 517147})
        raw!: number;

        @ApiProperty({example: '517μs'})
        formatted!: string;
    }

export class SubstanceDocument
    {
        @ApiProperty({example: 'clvdzrgn6003ef2ftau8csdb0'})
        id!: string;

        @ApiProperty({example: 'Caffeine'})
        name!: string;

        @ApiProperty({example: ['Caffeine']})
        commonNames!: string[];
    }

export class SubstanceHits
    {
        @ApiProperty({example: 'clvdzrgn6003ef2ftau8csdb0'})
        id!: string;

        @ApiProperty({example: 14.31518620955737})
        score!: number;

        @ApiProperty({type: SubstanceDocument})
        document!: SubstanceDocument;
    }

export class SubstanceResults
    {
        @ApiProperty({type: TimeMeasurement})
        elapsed!: TimeMeasurement;

        @ApiProperty({type: [SubstanceHits]})
        hits!: SubstanceHits[];

        @ApiProperty({example: 1})
        count!: number;
    }

@Controller('search')
export class SearchController
    implements OnApplicationBootstrap
    {
        private logger = new Logger('controller:search')
        private substanceSearchDatabase: Orama<{
            id: "string",
            name: "string",
            commonNames: "string[]",
        }> | undefined = undefined


        constructor(private readonly prismaService: PrismaService) {}

        @Get("/substance")
        @ApiOperation({
                          summary    : 'Search substances',
                          description: 'Search substances is optimized method for searching for a desired substance in the database, it uses a full-text search algorithm to find the most relevant substances based on the query - the index is built on `name` and `common_names` of the substance.',
                          operationId: 'search-substances',
                      })
        @ApiResponse({
                         status: 200,
                         type  : SubstanceResults,
                     })
        @ApiTags("Substance Warehouse")
        @ApiQuery({
                      name       : 'query',
                      type       : String,
                      required   : true,
                      example    : "Caffeine",
                      description: "Query for name of the substance (case-insensitive)."
                  })
        async search(@Query('query') query: string): Promise<SubstanceResults>
            {
                if (!this.substanceSearchDatabase)
                    {
                        throw new InternalServerErrorException('Substance search database not initialized');
                    }

                this.logger.debug(`Searching substances for query: ${query}`);

                // Validate input query to be a string
                if (typeof query !== 'string')
                    {
                        throw new BadRequestException('Invalid input');
                    }

                // Run a search query
                const searchResults = await search(this.substanceSearchDatabase, {
                    term: query,
                });

                this.logger.debug(`Search results: ${JSON.stringify(searchResults)}`);

                // Map the search results to the SearchResultsDto
                const resultsDto: SubstanceResults = {
                    elapsed: {
                        raw      : searchResults.elapsed.raw,
                        formatted: searchResults.elapsed.formatted,
                    },
                    hits   : searchResults.hits.map(hit => ({
                        id      : hit.id,
                        score   : hit.score,
                        document: {
                            id         : hit.document.id,
                            name       : hit.document.name,
                            commonNames: hit.document.commonNames,
                        },
                    })),
                    count  : searchResults.count,
                };

                return resultsDto;
            }


        async onApplicationBootstrap()
            {
                this.logger.debug('Indexing vector database of Substances...')

                type SubstanceDocument = TypedDocument<Orama<typeof substanceSchema>>

                const substanceSchema = {
                    id         : "string",
                    name       : 'string',
                    commonNames: 'string[]',
                } as const

                this.substanceSearchDatabase = await create({
                                                                schema: substanceSchema,
                                                            })

                this.logger.debug('Created database for substances...')

                const substances: Substance[] = await this.prismaService.substance.findMany()

                this.logger.debug(`Found ${substances.length} substances to be indexed...`)

                for (const substance of substances)
                    {
                        this.logger.debug(`Indexing ${substance.name}...`)

                        try
                            {
                                await insert(this.substanceSearchDatabase!, {
                                    id         : substance.id,
                                    name       : substance.name,
                                    commonNames: substance.common_names?.split(',') ?? [],
                                })
                            } catch (error)
                            {
                                this.logger.error(`Failed to index ${substance.name}: ${error}`)
                            }
                    }


                this.logger.debug('Indexed all substances...')
                this.logger.debug('Running a search query to ensure that the database is working...')

                // Run a search query to ensure that the database is working
                const searchResults = await search(this.substanceSearchDatabase, {
                    term: 'caffeine',
                })

                this.logger.debug(`Search results: ${JSON.stringify(searchResults)}`)
            }
    }
