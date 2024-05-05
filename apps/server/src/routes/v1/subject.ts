import { Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";

export class CreateSubject {
  @ApiProperty({ name: "givenName", description: "Given name of the subject", required: false })
  givenName?: string;

  @ApiProperty({ name: "familyName", description: "Family name of the subject", required: false })
  familyName?: string;

  @ApiProperty({ name: "birthDate", description: "Birth date of the subject", required: false })
  birthDate?: Date;
}

@ApiTags('Subject Profile')
@Controller('subject')
export class SubjectController {

  @ApiOperation({ summary: '🚧 Create subject', description: 'Creates a new subject for currently authenticated account. We recommend using only one subject profile for now as using multiple ones can lead to unexpected bugs.', operationId: 'create-subject' })
  @Post()
  async createSubject() {
    return "Subject created";
  }

  @ApiOperation({ summary: '🚧 Get subject', description: 'Retrieves the subject profile for currently authenticated account.', operationId: 'get-subject' })
  @Get()
  async getSubject() {
    return "Subject retrieved";
  }

  @ApiOperation({ summary: '🚧 Update subject', description: 'Updates the subject profile for currently authenticated account.', operationId: 'update-subject' })
  @Put()
  async updateSubject() {
    return "Subject updated";
  }

  @ApiOperation({ summary: '🚧 Delete subject', description: 'Deletes the subject profile for currently authenticated account.', operationId: 'delete-subject' })
  @Delete()
  async deleteSubject() {
    return "Subject deleted";
  }
}
