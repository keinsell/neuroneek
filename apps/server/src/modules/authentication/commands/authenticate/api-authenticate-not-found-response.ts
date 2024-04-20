import {ApiNotFoundResponse} from '@nestjs/swagger'
import {HttpProblem}         from '../../../../common/error/problem-details/http-problem.js'



export const ApiAuthenticateNotFoundResponse = ApiNotFoundResponse({
	                                                                   description: 'The user could not be found.',
	                                                                   type       : HttpProblem,
                                                                   })