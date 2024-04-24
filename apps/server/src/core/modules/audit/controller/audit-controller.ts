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

import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common"
import {ApiOperation, ApiParam, ApiResponse}             from "@nestjs/swagger"



@Controller("audit-trail")
export class AuditController {
	@ApiOperation({summary: 'List all audit records'}) @ApiResponse({
		status: 200, description: 'List of audit records',
	}) @Get() listRecords() {
		// Implement Logic
	}


	@ApiOperation({summary: 'Get an audit record by id'}) @ApiParam({
		name: 'id', required: true, description: 'Id of audit record',
	}) @ApiResponse({
		status: 200, description: 'Audit record detail',
	}) @Get(":id") getRecord(@Param("id") recordId : string) {
		// Implement Logic
	}


	@ApiOperation({summary: 'Create a new audit record'}) @ApiResponse({
		status: 201, description: 'Created new audit record',
	}) @Post() createRecord(@Body() record : any) {
		// Implement logic
	}


	@ApiOperation({summary: 'Update an audit record'}) @ApiParam({
		name: 'id', required: true, description: 'Id of audit record',
	}) @ApiResponse({
		status: 200, description: 'Updated an audit record',
	}) @Put(":id") updateRecord(
		@Param("id") recordId : string,
		@Body() record : any,
	)
	{
		// Implement logic
	}


	@ApiOperation({summary: 'Delete an audit record'}) @ApiParam({
		name: 'id', required: true, description: 'Id of audit record',
	}) @ApiResponse({
		status: 200, description: 'Deleted the audit record',
	}) @Delete(":id") deleteRecord(@Param("id") recordId : string) {
		// Implement logic
	}
}