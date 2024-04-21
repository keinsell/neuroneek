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

import {faker}         from '@faker-js/faker'
import {
	Injectable,
	Logger,
}                      from '@nestjs/common'
import type {Prisma}   from 'db'
import {SeederBase}    from '../../../common/libraries/seeder/seeder-base.js'
import {PrismaService} from '../../../common/modules/resources/prisma/services/prisma-service.js'



@Injectable()
export class RoleSeeder
	extends SeederBase<Prisma.RoleCreateInput>
{

	constructor(private prismaService: PrismaService)
	{
		super(new Logger('seeder:role'))

		this.provideDataset([
			                    {name: 'Super Administrator'},
			                    {name: 'Administrator'},
			                    {name: 'Customer Support'},
			                    {name: 'User'},
		                    ])
	}


	public async count(): Promise<number>
	{
		return this.prismaService.role.count()
	}


	public async exists(input: Prisma.RoleCreateInput): Promise<boolean>
	{
		const exists = await this.prismaService.role.findFirst({
			                                                       where: {
				                                                       name: input.name,
			                                                       },
		                                                       })

		return exists !== null
	}


	public async fabricate(): Promise<Prisma.RoleCreateInput>
	{
		return {
			name: faker.word.sample(),
		}
	}


	public save(input: Prisma.RoleCreateInput): Promise<unknown>
	{
		return this.prismaService.role.create({
			                                      data: input,
		                                      })
	}
}
