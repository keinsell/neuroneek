import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Post,
	Put,
	Req,
}                            from '@nestjs/common'
import {OnEvent}             from '@nestjs/event-emitter'
import {
	ApiBody,
	ApiOperation,
	ApiProperty,
	ApiTags,
}                            from '@nestjs/swagger'
import type {
	CartItem,
	Product,
}                            from 'db'
import {
	Cart,
	Customer,
}                            from 'db'
import {HttpProblem}         from '../../common/error/problem-details/http-problem.js'
import {HttpStatus}          from '../../common/http-status.js'
import {Event}               from '../../common/libraries/message/event.js'
import {EventBus}            from '../../common/modules/messaging/event-bus.js'
import {REQUEST_ID_HEADER}   from '../../common/modules/observability/request-identification/constant/REQUEST_ID_HEADER.js'
import {PrismaService}       from '../../common/modules/resources/prisma/services/prisma-service.js'
import {generateFingerprint} from '../../kernel/platform/http/middleware/fingerprint.js'
import {Account}             from '../../modules/account/entities/account.js'
import {RequestIdentity}     from '../../modules/authentication/request-identity.js'
import {ExpressRequest}      from '../../types/express-response.js'
import {ProductNotFound}     from './product-controller.js'



type CombinedDecorators = (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => void;

const combineDecorators = (...decorators: Array<Function>): CombinedDecorators =>
{
	return (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) =>
	{
		decorators.forEach(decorator => decorator(target, propertyKey, descriptor))
	}
}


export class CartItemNotFound
	extends HttpProblem
{
	constructor(cartItemId: string)
	{
		super({
			      type    : 'com.application.cart-item.not-found',
			      title   : 'Cart Item Not Found',
			      status  : HttpStatus.NOT_FOUND,
			      instance: `com.application.cart-item.${cartItemId}`,
			      message : 'The cart item could not be found.',
		      })
	}
}


export class AddItemToCart
{
	@ApiProperty({example: 'gpu.nvidia.rtx.4090'}) productId: string
	@ApiProperty({example: 1}) quantity: number
}


export class ApiCartItem
{
	@ApiProperty() id: string
	@ApiProperty() cartId: string
	@ApiProperty() productId: string
	@ApiProperty() quantity: number
	@ApiProperty() createdAt: Date
	@ApiProperty() updatedAt: Date
}


export interface CartItemAddedEventBody
{
	id: string
	cartId: string
	productId: string
	quantity: number
	total: number
	currency: string
	quantityAdded: number
	totalAdded: number
}


export interface CartItemDeletedEventBody
{
	id: string
	cartId: string
	productId: string
	quantity: number
	total: number
	currency: string
}


export class CartItemAddedEvent
	extends Event<CartItemAddedEventBody>
{
	constructor(body: CartItemAddedEventBody)
	{
		super({
			      namespace: 'cart.item.added',
			      body,
		      })
	}
}


export class CartItemDeletedEvent
	extends Event<CartItemDeletedEventBody>
{
	constructor(body: CartItemDeletedEventBody)
	{
		super({
			      namespace: 'cart.item.deleted',
			      body,
		      })
	}
}


export class ApiCart
{
	@ApiProperty() id: string
	@ApiProperty() customerId: string
	@ApiProperty() fingerprint: string
	@ApiProperty() createdAt: Date
	@ApiProperty() updatedAt: Date
}


export const ApiAddItemToCart = combineDecorators(ApiOperation({
	                                                               operationId: 'add-cart-item',
	                                                               summary    : 'Add item to cart',
                                                               }), ApiBody({type: AddItemToCart}))

export const apiPropertySubtotal = ApiProperty({
												 type       : 'number',
	                                             name       : 'subtotal',
	                                             description: 'Subtotal is the total price of all items in the cart',
											 })

export const apiPropertyQuantity = ApiProperty({
												 type       : 'number',
	                                             name       : 'quantity',
	                                             description: 'The quantity of the product in the cart',
											 })

export const apiPropertyTotal = ApiProperty({
											  type       : 'number',
	                                          name       : 'total',
	                                          description: 'The total price of the product in the cart',
										  })

export const apiPropertyCurrency = ApiProperty({
												 type       : 'string',
	                                             name       : 'currency',
	                                             description: 'The currency of the price',
											 })



@ApiTags('cart') @Controller('cart')
export class CartController
{
	private logger: Logger = new Logger('domain:controller:cart')
	private cartRepository: PrismaService['cart']
	private customerRepository: PrismaService['customer']
	private cartItemRepository: PrismaService['cartItem']
	private productRepository: PrismaService['product']
	private bus: EventBus

	constructor(prisma: PrismaService, bus: EventBus)
	{
		this.cartRepository     = prisma.cart
		this.customerRepository = prisma.customer
		this.cartItemRepository = prisma.cartItem
		this.productRepository  = prisma.product
		this.bus                = bus
	}

	@Get()
	private async getMyCart(@Req() request: ExpressRequest, @RequestIdentity() user?: Account)
	{
		let cart: Cart | null         = null
		let customer: Customer | null = null

		const fingerprint = generateFingerprint(request)

		console.log(request.fingerprint)
		console.log(request.headers[REQUEST_ID_HEADER])

		// Find a Customer related to the authenticated user
		if (user)
		{
			customer = await this.customerRepository.findFirst({
				                                                   where: {User: {accountId: user.id}},
			                                                   })
		}

		// If there is a customer related to the user, find a cart associated with the customer
		if (customer)
		{
			cart = await this.cartRepository.findFirst({where: {customerId: customer.id}})
		}

		// If no cart is found for the customer, find a cart associated with the user's fingerprint
		if (!cart)
		{
			cart = await this.cartRepository.findFirst({
				                                           where  : {fingerprint: fingerprint},
				                                           include: {CartItem: true},
			                                           })
		}

		// If no cart is found for the fingerprint, create a new cart for the user
		if (!cart)
		{
			cart = await this.cartRepository.create({
				                                        data: {
					                                        customerId : customer?.id,
					                                        fingerprint: fingerprint,
				                                        },
			                                        })
		}

		// Cart should be refreshed in the background as prices of product may change with time,
		// and cart does not point to real-time products at all.

		// Return the user's cart
		return cart
	}


	@Put()
	private async updateMyCart(@RequestIdentity() user: Account, @Req() request: any, @Req() fp: any)
	{
		const fingerprint = generateFingerprint(request)
		const cart        = await this.getUserCartByAccountAndFingerprint(fingerprint, user)

		// Update a cart with the provided data
		// This is complex operation as it must overall atomicity and events produced during cart operations,
		// so it's not implemented yet.

		// TODO: Add cart update model

		return cart
	}

	@Delete()
	private deleteMyCart()
	{
		return 'Hello, cart!'
	}

	private async getUserCartByAccountAndFingerprint(fingerprint: string, user?: Account): Promise<Cart>
	{
		let cart: Cart | null         = null
		let customer: Customer | null = null

		// Find a Customer related to the authenticated user
		if (user)
		{
			customer = await this.customerRepository.findFirst({
				                                                   where: {User: {accountId: user.id}},
			                                                   })
		}

		// If there is a customer related to the user, find a cart associated with the customer
		if (customer)
		{
			cart = await this.cartRepository.findFirst({where: {customerId: customer.id}})
		}

		// If no cart is found for the customer, find a cart associated with the user's fingerprint
		if (!cart)
		{
			cart = await this.cartRepository.findFirst({where: {fingerprint: fingerprint}})
		}

		// If no cart is found for the fingerprint, create a new cart for the user
		if (!cart)
		{
			cart = await this.cartRepository.create({
				                                        data: {
					                                        customerId : customer?.id,
					                                        fingerprint: fingerprint,
				                                        },
			                                        })
		}

		// Return the user's cart
		return cart
	}

	@Post('item') @ApiOperation({
		                            operationId: 'add-cart-item',
		                            summary    : 'Add item to cart',
	                            })
	private async addItemToCart(@Body() requestBody: AddItemToCart, @Req() request: any, @RequestIdentity() user?: Account)
	{
		let product: Product | null = null
		let cartItem: any | null    = null

		this.logger.debug('Fetching a cart of a user...')

		// Get a cart by the user's fingerprint
		const fingerprint = generateFingerprint(request)
		const cart        = await this.getUserCartByAccountAndFingerprint(fingerprint, user)

		this.logger.debug('Received a cart of a user...', cart)

		// Once we have a cart, we must check if the product is already in the cart, if so, we must update the quantity
		// of the product in the cart.

		this.logger.debug('Fetching a product to add to the cart...')

		// Find a product by the provided productId
		product = await this.productRepository.findFirst({where: {id: requestBody.productId}})

		if (!product)
		{
			throw new ProductNotFound(requestBody.productId)
		}

		this.logger.debug('Received a product to add to the cart...', product)

		this.logger.debug('Updating CartItem entity with the new quantity and price...', {body: requestBody})

		// TODO: Add Currency Conversion support

		cartItem = await this.cartItemRepository.upsert({
			                                                where : {
				                                                cartId_productId: {
					                                                cartId   : cart.id,
					                                                productId: requestBody.productId,
				                                                },
			                                                },
			                                                create: {
				                                                cartId   : cart.id,
				                                                productId: requestBody.productId,
				                                                quantity : requestBody.quantity,
				                                                price    : requestBody.quantity * product.price,
				                                                currency : 'USD',
			                                                },
			                                                update: {
				                                                cartId   : cart.id,
				                                                productId: requestBody.productId,
				                                                price    : {
					                                                increment: requestBody.quantity * product.price,
				                                                },
				                                                quantity : {
					                                                increment: requestBody.quantity,
				                                                },
				                                                currency : 'USD',
			                                                },
		                                                })

		this.logger.log('CartItem entity updated')

		this.logger.debug('Emitting CartItemAdded event...')

		// Emit an event that the cart item was added
		this.bus.publish(new CartItemAddedEvent({
			                                        id           : cartItem.id,
			                                        cartId       : cartItem.cartId,
			                                        productId    : cartItem.productId,
			                                        quantity     : cartItem.quantity,
			                                        total        : cartItem.price,
			                                        currency     : cartItem.currency,
			                                        quantityAdded: requestBody.quantity,
			                                        totalAdded   : requestBody.quantity * product.price,
		                                        }))

		this.logger.debug('Returning the updated/created CartItem...')

		// Return the updated/created CartItem
		return cartItem
	}

	@Delete('item/:cartItemId')
	private async removeItemFromCart(@Req() request: ExpressRequest, @Param('cartItemId') cartItemId: string, @RequestIdentity() user?: Account)
	{
		let product: Product | null   = null
		let cartItem: CartItem | null = null

		this.logger.debug('Fetching a cart of a user...')

		// Get a cart by the user's fingerprint
		const fingerprint = generateFingerprint(request)
		const cart        = await this.getUserCartByAccountAndFingerprint(fingerprint, user)

		this.logger.debug('Received a cart of a user...', cart)

		let cartItemToDelete = await this.cartItemRepository.findFirst({where: {id: request.params.id}})

		if (!cartItemToDelete)
		{
			throw new CartItemNotFound(request.params.id)
		}

		this.logger.debug('Removing item from cart...')

		await this.cartItemRepository.delete({where: {id: cartItemId}})

		this.logger.debug('CartItem entity removed')

		this.logger.debug('Emitting CartItemDeleted event...')

		// Emit an event that the cart item was added

		this.bus.publish(new CartItemDeletedEvent({
			                                          id       : cartItemId,
			                                          cartId   : cart.id,
			                                          productId: cartItemToDelete.productId,
			                                          quantity : cartItemToDelete.quantity,
			                                          total    : cartItemToDelete.price,
			                                          currency : cartItemToDelete.currency,
		                                          }))

		this.logger.log('Deleted CartItem')

		return 'ok'
	}

	@Put('item/:cartItemId')
	private updateItemInCart()
	{
		return 'Hello, cart!'
	}

	@OnEvent('cart.item.added', {async: true})
	private async onCartItemAdded(event: CartItemAddedEvent)
	{
		this.logger.debug('Received CartItemAdded event...', event)


		this.logger.debug('Updating Cart with CartItem data', event)
		await this.cartRepository.update({
			                                 where: {id: event.body.cartId},
			                                 data : {
				                                 quantity: {
					                                 increment: event.body.quantityAdded,
				                                 },
				                                 total   : {
					                                 increment: event.body.totalAdded,
				                                 },
				                                 subtotal: {
					                                 increment: event.body.totalAdded,
				                                 },
				                                 currency: event.body.currency,
			                                 },
		                                 })
	}

	@OnEvent('cart.item.deleted', {async: true})
	private async onCartItemDeleted(event: CartItemDeletedEvent)
	{
		this.logger.debug('Received CartItemDeleted event...', event)

		this.logger.debug('Updating Cart with CartItem data', event)
		await this.cartRepository.update({
			                                 where: {id: event.body.cartId},
			                                 data : {
				                                 quantity: {
					                                 decrement: event.body.quantity,
				                                 },
				                                 total   : {
					                                 decrement: event.body.total,
				                                 },
				                                 subtotal: {
					                                 decrement: event.body.total,
				                                 },
				                                 currency: event.body.currency,
			                                 },
		                                 })
	}
}
