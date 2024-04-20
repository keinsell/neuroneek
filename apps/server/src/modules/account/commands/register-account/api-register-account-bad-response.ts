import {
	ApiResponse,
	getSchemaPath,
}                    from '@nestjs/swagger'
import {HttpProblem} from '../../../../common/error/problem-details/http-problem.js'



export const ApiRegisterAccountBadResponse = ApiResponse({
	                                                         status     : 400,
	                                                         description: 'User could not be registered due to invalid data.',
	                                                         content    : {
		                                                         'application/json': {
			                                                         schema: {
				                                                         $ref    : getSchemaPath(HttpProblem),
				                                                         type    : 'object',
				                                                         example : {
					                                                         type  : 'com.methylphenidate.account.invalid-username',
					                                                         title : 'Invalid Username',
					                                                         status: 400,
				                                                         },
				                                                         examples: [
					                                                         {
						                                                         type  : 'com.neuronek.account.invalid-email',
						                                                         title : 'Invalid Email',
						                                                         status: 400,
					                                                         },
				                                                         ],
			                                                         },
		                                                         },
	                                                         },
                                                         })