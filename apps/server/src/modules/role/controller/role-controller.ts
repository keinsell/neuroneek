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
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
}                       from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'



@Controller( 'role' )
export class RoleController
  {
	 @ApiOperation( {operationId : 'list-roles'} ) @Get() getRoles()
		{
		  // code to get roles
		}

	 @ApiOperation( {operationId : 'get-role'} ) @Get( '/:id' ) getRoleById(@Param( 'id' ) id : string)
		{
		  // code to get role by id
		}

	 @ApiOperation( {operationId : 'patch-role'} ) @Patch( '/:id' ) updateRole(@Param( 'id' ) id : string)
		{
		  // code to update role by id
		}

	 @ApiOperation( {operationId : 'create-role'} ) @Post( '' ) createRole()
		{
		  // code to create a new role
		}

	 @ApiOperation( {operationId : 'delete-role'} ) @Delete( '/:id' ) deleteRole(@Param( 'id' ) id : string)
		{
		  // code to delete role by id
		}
  }