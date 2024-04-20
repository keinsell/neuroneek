import {Body, Controller, Patch, Post, Req, UseGuards}                                         from '@nestjs/common'
import {ApiBody, ApiConflictResponse, ApiOkResponse, ApiOperation, ApiResponse, getSchemaPath} from '@nestjs/swagger'
import {getCurrentScope}                                                                       from '@sentry/node'
import {Request}                                                                               from 'express'
import {readFileSync}                                                                          from 'node:fs'
import {dirname}                                                                               from 'path'
import {fileURLToPath}                                                                         from 'url'
import {HttpProblem}                                                                           from '../../../common/error/problem-details/http-problem.js'
import {JwtAuthorizationGuard}                                                                 from '../../authentication/guards/jwt-authorization-guard.js'
import {RegisterAccountCommand}                                                                from '../commands/register-account/register-account-command.js'
import {AccountService}                                                                        from '../services/account-service.js'
import {AccountViewModel}                                                                      from '../view-model/account-view-model.js'



function getOperationDocumentation(operation: string): string {
	const __filename         = fileURLToPath(import.meta.url)
	const __dirname          = dirname(__filename)
	const docsDirectory      = `${__dirname}/../10-application/docs`
	const operationDirectory = `${docsDirectory}/operations`

	try {
		return readFileSync(`${operationDirectory}/${operation}.md`, 'utf8')
		//return import(`${operationDirectory}/${operation}.md`) as
		// string
	} catch (e) {
		return ''
	}
}


@Controller('account')
export class AccountController {
	constructor(private service: AccountService) {
	}


	@ApiOperation({
		operationId: 'register',
		summary:     'Register account',
		description: getOperationDocumentation('register'),
		tags:        ['account'],
	}) @ApiBody({type: RegisterAccountCommand}) @ApiOkResponse({
		type:        AccountViewModel,
		description: 'Account was successfully registered in system.',
	}) @Post() @ApiConflictResponse({
		type:        HttpProblem,
		description: 'Account already exists.',
		content:     {
			example: {
						 type:   'https://httpstatuses.com/409',
						 title:  'Conflict',
						 status: 409,
						 detail: 'Account already exists.',
					 } as any,
		},
	}) @ApiResponse({
		status:      400,
		description: 'Provided Invalid Data',
		content:     {
			'application/json': {
				schema: {
					$ref:     getSchemaPath(HttpProblem),
					type:     'object',
					example:  {
						type:   'com.methylphenidate.account.invalid-username',
						title:  'Invalid Username',
						status: 400,
					},
					examples: [
						{
							type:   'com.methylphenidate.account.invalid-email',
							title:  'Invalid Email',
							status: 400,
						},
					],
				},
			},
		},
	})

	async register(@Req() request: Request, @Body() registerAccountBody: RegisterAccountCommand): Promise<AccountViewModel> {
		const result = await this.service.register({
			username: registerAccountBody.username,
			email:    registerAccountBody.email,
			password: registerAccountBody.password,
		})

		getCurrentScope()
		.setUser({
			username: result.username,
			email:    result.email.address,
		})

		return {
			id:            result.id,
			email:         result.email.address,
			emailVerified: result.email.isVerified,
			username:      result.username,
		}
	}


	@UseGuards(JwtAuthorizationGuard) @ApiOperation({
		operationId: 'update-account',
		description: 'Update details of account.',
		tags:        ['account'],
	}) @Patch()
	async updateAccount(): Promise<string> {
		// Find a account that needs to be updated
		return 'change-password'
	}


	@UseGuards(JwtAuthorizationGuard) @ApiOperation({
		operationId: 'delete-account',
		description: 'Deletes the user\'s account.',
		tags:        ['account'],
	}) @Post('delete-account')
	async deleteAccount(): Promise<string> {
		return 'delete-domain'
	}
}