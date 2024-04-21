import {
  Controller,
  Get,
}                        from '@nestjs/common'
import {
  ApiOperation,
  ApiQuery,
}                        from '@nestjs/swagger'
import { OpenapiTags }   from '../../../common/modules/documentation/swagger/openapi-tags.js'
import { AccountStatus } from '../value-objects/account-status.js'



@Controller( 'accounts' )
export class AccountManagementController
  {

	 // TODO: List all accounts of system
	 @Get() @ApiOperation( {
									 operationId : 'list-accounts',
									 tags        : [ OpenapiTags.ACCOUNT_MANAGEMENT ],
								  } ) @ApiQuery( {
														 type            : String,
														 enum            : AccountStatus,
														 name            : 'status',
														 allowEmptyValue : false,
														 required        : false,
														 description     : 'Filter accounts by status',
													  } )
	 public async getAccounts()
		{
		}


	 // TODO: Get single account by ID

	 // TODO: Update single account

	 // TODO: Bulk update multiple accounts

	 // TODO: Force password reset
  }