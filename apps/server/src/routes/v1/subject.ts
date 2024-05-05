import {Body, Controller, Delete, Get, Logger, Post, Put, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiOperation, ApiProperty, ApiTags} from "@nestjs/swagger";
import {Prisma} from "@neuronek/db/generated/prisma-client";
import {Account} from "db";
import {Subject} from "../../_gen/subject";
import {JwtAuthorizationGuard} from "../../core/identity/authn/components/guards/jwt-authorization-guard";
import {GetUser} from "../../core/identity/authn/jwt-authentication-strategy";
import {PrismaService} from "../../core/modules/database/prisma/services/prisma-service";

export class CreateSubject
    {
        @ApiProperty({name: "givenName", description: "Given name of the subject", required: false, example: "Albert"})
        givenName?: string;

        @ApiProperty(
            {name: "familyName", description: "Family name of the subject", required: false, example: "Einstein"})
        familyName?: string;

        @ApiProperty({
                         name       : "birthDate",
                         description: "Birth date of the subject",
                         required   : false,
                         example    : "1879-03-14T00:00:00.000Z"
                     })
        birthDate?: Date;
    }

@ApiTags('Subject Profile')
@Controller('subject')
export class SubjectController
    {

        private logger = new Logger(SubjectController.name);

        constructor(
            private readonly prismaService: PrismaService,
        )
            {}

        @ApiBearerAuth()
        @UseGuards(JwtAuthorizationGuard)
        @ApiOperation({
                          summary    : '🚧 Create subject',
                          description: 'Creates a new subject for currently authenticated account. We recommend using only one subject profile for now as using multiple ones can lead to unexpected bugs.',
                          operationId: 'create-subject'
                      })
        @Post()
        async createSubject(
            @Body() createSubject: CreateSubject,
            @GetUser() user: Account,
        ): Promise<Subject>
            {
                // Validate input for createSubject

                // Create subject
                const prismaCreateSubject: Prisma.SubjectCreateInput = {
                    firstName  : createSubject.givenName,
                    lastName   : createSubject.familyName,
                    dateOfBirth: createSubject.birthDate,
                    account    : {
                        connect: {
                            id: user.id
                        }
                    }
                }

                // Create subject
                const subject = await this.prismaService.subject.create({
                                                                            data: prismaCreateSubject
                                                                        });


                this.logger.debug(`Created subject: ${JSON.stringify(subject)}`)

                return subject as any;
            }

        @ApiOperation({
                          summary    : '🚧 Get subject',
                          description: 'Retrieves the subject profile for currently authenticated account.',
                          operationId: 'get-subject'
                      })
        @Get()
        async getSubject()
            {
                return "Subject retrieved";
            }

        @ApiOperation({
                          summary    : '🚧 Update subject',
                          description: 'Updates the subject profile for currently authenticated account.',
                          operationId: 'update-subject'
                      })
        @Put()
        async updateSubject()
            {
                return "Subject updated";
            }

        @ApiOperation({
                          summary    : '🚧 Delete subject',
                          description: 'Deletes the subject profile for currently authenticated account.',
                          operationId: 'delete-subject'
                      })
        @Delete()
        async deleteSubject()
            {
                return "Subject deleted";
            }
    }
