/*
 * MIT License
 *
 * Copyright (c) 2023 Jakub Olan <keinsell@protonmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
}                      from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Group }       from '../entities/group.js'



/**
 * Controller class for managing groups.
 *
 * @class
 * @controller
 * @param {string} path - The base URL path for all group endpoints.
 */
@Controller( 'group' )
export class GroupController
  {
	 @Post() @ApiResponse( {
									 status      : 201,
									 description : 'The group has been successfully created.',
								  } )
	 async create(@Body() createGroupDto : any)
		{
		}

	 @Get() @ApiResponse( {
									status  : 200,
									type    : Group,
									isArray : true,
								 } )
	 async findAll()
		{

		}

	 @Get( ':id' ) @ApiResponse( {
											 status : 200,
											 type   : Group,
										  } )
	 async findOne(@Param( 'id' ) id : string)
		{

		}

	 @Put( ':id' ) @ApiResponse( {
											 status      : 200,
											 description : 'The group has been successfully updated',
										  } )
	 async update(
		@Param( 'id' ) id : string,
		@Body() updateGroupDto : any,
	 )
		{
		}

	 @Delete( ':id' ) @ApiResponse( {
												 status      : 200,
												 description : 'The group has been successfully deleted',
											  } )
	 async delete(@Param( 'id' ) id : string)
		{
		}
  }