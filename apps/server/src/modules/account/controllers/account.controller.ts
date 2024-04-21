import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { getCurrentScope } from '@sentry/node';
import { Request } from 'express';
import { readFileSync } from 'node:fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { HttpProblem } from '../../../common/error/problem-details/http-problem.js';
import { JwtAuthorizationGuard } from '../../authentication/guards/jwt-authorization-guard.js';
import { RegisterAccountCommand } from '../commands/register-account/register-account-command.js';
import { AccountService } from '../services/account-service.js';
import { AccountViewModel } from '../view-model/account-view-model.js';

function getOperationDocumentation(operation: string): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const docsDirectory = `${__dirname}/../10-application/docs`;
  const operationDirectory = `${docsDirectory}/operations`;

  try {
    return readFileSync(`${operationDirectory}/${operation}.md`, 'utf8');
    //return import(`${operationDirectory}/${operation}.md`) as
    // string
  } catch (e) {
    return '';
  }
}

@Controller('account')
export class AccountController {
  constructor(private service: AccountService) {}

  @UseGuards(JwtAuthorizationGuard)
  @ApiOperation({
    operationId: 'update-account',
    description: 'Update details of account.',
    tags: ['account'],
  })
  @Patch()
  async updateAccount(): Promise<string> {
    // Find a account that needs to be updated
    return 'change-password';
  }

  @UseGuards(JwtAuthorizationGuard)
  @ApiOperation({
    operationId: 'delete-account',
    description: "Deletes the user's account.",
    tags: ['account'],
  })
  @Post('delete-account')
  async deleteAccount(): Promise<string> {
    return 'delete-domain';
  }
}
