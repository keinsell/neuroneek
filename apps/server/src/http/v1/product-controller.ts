/*
 * MIT License
 *
 * Copyright (c) 2024 Jakub Olan <keinsell@protonmail.com>
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
	Logger,
	OnApplicationBootstrap,
	Patch,
	Post,
}                      from '@nestjs/common'
import {
	ApiBody,
	ApiOkResponse,
	ApiOperation,
	ApiProperty,
	ApiTags,
}                      from '@nestjs/swagger'
import {
	AttributeType,
	Prisma,
	Product,
}                      from 'db'
import { HttpProblem } from '../../common/error/problem-details/http-problem.js';
import { HttpStatus }  from '../../common/http-status.js';
import {PrismaService} from '../../common/modules/resources/prisma/services/prisma-service.js'

export class ProductNotFound extends HttpProblem {
	constructor(productId: string)
	{
		super(
			{
				type: 'com.application.product.not-found',
				title: 'Product Not Found',
				status: HttpStatus.NOT_FOUND,
				instance: `com.application.product.${productId}`,
				message: 'The product could not be found.',
			}
		)
	}
}

export class CreateProduct
	implements Prisma.ProductCreateInput
{
	public attributes: Prisma.ProductAttributeCreateNestedManyWithoutProductInput
	@ApiProperty({
		             type       : 'string',
		             name       : 'currency',
		             description: 'The currency of the price',
		             example    : 'PLN',
	             }) public currency: string
	@ApiProperty({
		             type       : 'string',
		             name       : 'name',
		             description: 'The name of the product',
		             example    : 'NVIDIA RTX 4090',
	             }) public name: string
	@ApiProperty({
		             type       : 'number',
		             name       : 'price',
		             description: 'The price of the product',
		             example    : 10_000_00,
	             }) public price: number
	public variants: Prisma.ProductVariantCreateNestedManyWithoutProductInput
}


export const ApiPropertyProductId = ApiProperty({
	type       : 'string',
	name       : 'productId',
	description: 'The product ID',
	example    : 'gpu.nvidia.rtx.4090',
})


export class ApiProduct
{
	@ApiPropertyProductId
	public id: string
	//	@ApiProperty({type: 'string', name: 'name', description: 'The name of the product', example: "NVIDIA RTX
	// 4090"})
	public name: string
	//	@ApiProperty({type: 'number', name: 'price', description: 'The price of the product', example: 10_000_00})
	public price: number
	//	@ApiProperty({type: 'string', name: 'currency', description: 'The currency of the price', example: "PLN"})
	public currency: string
	//	@ApiProperty({type: 'array', name: 'attributes', description: 'The attributes of the product'})
	public attributes: ApiProductAttribute[]
}


export class ApiProductAttribute
{
	//	@ApiProperty({type: 'string', name: 'name', description: 'The name of the attribute', example: "Memory"})
	public name: string
	//	@ApiProperty({type: 'string', name: 'description', description: 'The description of the attribute', example:
	// "The amount of memory available on the graphics card for storing data and textures."})
	public description: string
	//	@ApiProperty({ name: 'value', description: 'The value of the attribute', example: "10 GB", })
	public value: string
}


@ApiTags('product') @Controller('product')
export class ProductController
	implements OnApplicationBootstrap
{
	private logger: Logger = new Logger('http:product')

	constructor(private prismaService: PrismaService)
	{
	}


	@ApiBody({type: CreateProduct}) @Post() @ApiOperation({
		                                                      tags       : ['product'],
		                                                      summary    : 'Create product',
		                                                      operationId: 'create-product',
	                                                      })
	async createProduct(@Body() create: Prisma.ProductCreateInput): Promise<Product>
	{
		const product = await this.prismaService.product.create({
			                                                        data: {
				                                                        name    : 'Nvidia RTX 3080',
				                                                        price   : 699.99,
				                                                        currency: 'USD',
				                                                        variants: {
					                                                        create: {},
				                                                        },
			                                                        },
		                                                        })

		return product
	}


	@Get() @ApiOperation({
		                     tags       : ['product'],
		                     summary    : 'List products',
		                     operationId: 'list-products',
	                     }) @ApiOkResponse({type: [ApiProduct]})
	async listProducts(): Promise<Product[]>
	{
		return this.prismaService.product.findMany({
			                                           include: {
				                                           ProductAttribute: true,
				                                           variants  : true,
			                                           },
		                                           })
	}


	@Get(':id') @ApiOperation({
		                          tags       : ['product'],
		                          summary    : 'Get product',
		                          operationId: 'get-product',
	                          })
	async getProduct(): Promise<string>
	{
		return 'get-product'
	}


	@Patch(':id')
	async updateProduct(): Promise<string>
	{
		return 'update-product'
	}


	@Delete(':id')
	async deleteProduct(): Promise<string>
	{
		return 'delete-product'
	}

	public async onApplicationBootstrap(): Promise<any>
	{
	//  Create a promise that will be handled in background (seedModule)
		this.seedModule().then(() => {
			this.logger.debug('Product Module seeded')
		})
	}

	private async seedModule() {
		this.logger.debug('Bootstrapping Product Module')

		this.logger.debug('Preparing seed of core information into database...')

		// Product #1 - NVIDIA RTX 4090
		//
		// NVIDIA RTX 4090
		// Price: 10 000,00 PLN
		// NVIDIA RTX 4090 is a high-end graphics card designed for gaming and professional use. It features the latest
		// technologies such as ray tracing and DLSS, making it the best choice for gamers and professionals alike.
		//
		// Attributes:
		// DLSS: true
		// Shader Cores: 10 240
		// Ray Tracing Cores: 160
		// Memory: 24 GB GDDR6X
		// NVENC: true
		// Base Clock: 1.5 GHz
		// Boost Clock: 2.5 GHz
		// TDP: 400 W
		// GPU Architecture: Ada Lovelace
		// Dimensions: 10.5" x 4.4" x 2.5"

		const products: Prisma.ProductCreateInput[] = [
			{
				id: 'gpu.nvidia.rtx.4090',
				name      : 'NVIDIA RTX 4090',
				price     : 10_000_00,
				currency  : 'PLN',
				ProductAttribute: {
					createMany: {
						skipDuplicates: true,
						data          : [
							{
								uid: "gpu.dlss",
								name       : 'DLSS',
								type       : AttributeType.BOOLEAN,
								description: String`
DLSS is a deep learning technology that uses AI to boost frame rates and generate beautiful, sharp images for your games. DLSS leverages the power of a deep learning neural network to boost frame rates and generate beautiful, sharp images for your games.
`,
							},
							{
								uid: "gpu.shader_cores",
								name       : 'Shader Cores',
								type       : AttributeType.INTEGER,
								description: String`
Shader Cores are the processing units in NVIDIA graphics processing units (GPUs) that perform computations and execute instructions. Shader Cores are designed to handle large numbers of threads in parallel, making them highly efficient for tasks that can be broken down into many smaller ones, such as rendering graphics or performing scientific computations.
								`,
							},
							{
								uid: "gpu.ray_tracing_cores",
								name       : 'Ray Tracing Cores',
								type       : AttributeType.INTEGER,
								description: String`
							
Ray Tracing Cores are the processing units in NVIDIA graphics processing units (GPUs) that perform computations and execute instructions. Ray Tracing Cores are designed to handle large numbers of threads in parallel, making them highly efficient for tasks that can be broken down into many smaller ones, such as rendering graphics or performing scientific computations.
								`,
							}
						],
					},
				},
			},
		]

		// Seed products into database
		for (const product of products)
		{
			await this.prismaService.product.create({data: product})
		}
	}
}

export const ApiPropertyProduct = ApiProperty({
	type       : ApiProduct,
	name       : 'product',
	description: 'The product',
})
