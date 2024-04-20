//DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
//Version 2, December 2004
//
//Copyright (C) 2023 Jakub Olan <keinsell@protonmail.com>
//
//DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
//TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
//
//0. You just DO WHAT THE FUCK YOU WANT TO.
//
	import {PLN, USD} from "@dinero.js/currencies"
import {
	Body, Controller, Delete, Get, Logger, Post, UseGuards,
} from '@nestjs/common';
import {
	ApiBody, ApiOkResponse, ApiOperation, ApiProperty, ApiTags,
}                                             from '@nestjs/swagger';
import {allocate, dinero, multiply, subtract} from "dinero.js"
import { PrismaService }                      from '../../common/modules/resources/prisma/services/prisma-service.js';
import { Account }         from '../../modules/account/entities/account.js';
import {JwtAuthorizationGuard} from "../../modules/authentication/guards/jwt-authorization-guard.js"
import { RequestIdentity }                                                                           from '../../modules/authentication/request-identity.js';
import {Checkout, Invoice, InvoiceStatus, Payment, PaymentMethod, PaymentProcessor, Prisma, Product} from 'db'
import {apiPropertySubtotal}                                                                         from "./cart.js"
import {ApiProduct, ApiPropertyProduct, ApiPropertyProductId, ProductNotFound} from './product-controller.js';

export class AddCheckoutItem {
	@ApiPropertyProductId
	productId: string
	@ApiProperty({type: 'number', example: 1})
	quantity: number
}

export class ApiCheckoutItem {
	@ApiPropertyProduct
	product: ApiProduct
	@ApiProperty({type: 'number', example: 1})
	quantity: number
	@apiPropertySubtotal
	subtotal: number
	@ApiProperty({type: 'number', example: 100})
	discount: number
	@ApiProperty({type: 'number', example: 230})
	tax: number
	@ApiProperty({type: 'number', example: 900})
	total: number
}

export class CheckoutPaymentMethods {
	@ApiProperty({type: 'array', items: {type: 'string'}, example: ['stripe']})
	paymentMethods: string[]
}

export class CheckoutStripePaymentMethod {
	@ApiProperty({type: 'string', example: 'cus_J3z3v2eZvKYlo2C5z3v2eZvKYlo', required: false})
	customerId?: string
	@ApiProperty({type: 'string', example: 'pm_1J3z3v2eZvKYlo2C5z3v2eZvKYlo', required: false})
	paymentMethodId: string
}


export class CheckoutPaymentMethod {
	@ApiProperty({type: CheckoutStripePaymentMethod, required: false})
	[PaymentProcessor.STRIPE]?: CheckoutStripePaymentMethod
	[PaymentProcessor.PAYPAL]?: {
		accountId: string
	}
	[PaymentProcessor.MANUAL]?: {}
}

export class InitializeCheckout
{
	@ApiProperty({type: CheckoutPaymentMethod})
	paymentMethod?: CheckoutPaymentMethod
	shipmentMethod?: {
		provider: string
		service: string
	}
	@ApiProperty({type: [AddCheckoutItem]})
	items: AddCheckoutItem[]
}

export class CheckoutSummary {
	@ApiProperty({type: [ApiCheckoutItem]})
	items: ApiCheckoutItem[]
	@ApiProperty({type: 'string', example: 'PLN'})
	currency: string
	@ApiProperty({type: 'number', example: 1000})
	total: number
}

@ApiTags("Checkout")
@Controller('checkout')
export class CheckoutController
{
	/** List with services available in backend for processing payments */
	private PAYMENT_METHOD_SERVICES: {paymentProcessorId: PaymentProcessor}[] = [
		{paymentProcessorId: PaymentProcessor.STRIPE}
]

	/** List of avaliable shipment providers */
	private SHIPMENT_METHOD_SERVICES: {shipmentMethodIdentifier: string}[] = [
		{shipmentMethodIdentifier: "dhl"}
	]

	private logger: Logger = new Logger('checkout')

	private readonly productRepository: Prisma.ProductDelegate
	private readonly checkoutRepository: Prisma.CheckoutDelegate
	private readonly invoiceRepository: Prisma.InvoiceDelegate

	constructor(private prisma: PrismaService)
	{
		this.productRepository = prisma.product
		this.checkoutRepository = prisma.checkout
		this.invoiceRepository = prisma.invoice
	}

	// Before a user can make a checkout, they need to have knowledge about existing methods of payment.
	// This method should return a list of available payment methods, which user can choose from.
	// This method should be called before the checkout process is initialized.

	@ApiOperation({summary: "Available PaymentMethods for Checkout", operationId: 'get-checkout-payment-methods',})
	@ApiOkResponse({type: CheckoutPaymentMethods})
	@Get('payment-methods')
	async getPaymentMethods()
	{
		return this.PAYMENT_METHOD_SERVICES.map((service) => service.paymentProcessorId)
	}

	// Some orders that aren't physical goods may need to define shipment method,
	// there are lots of them, and in fact we're a billing customer for the option he will choose,
	// in order - we must add endpoint to expose available shipment methods.

	@Get('shipment-methods')
	async getShipmentMethods()
	{
		return this.SHIPMENT_METHOD_SERVICES.map((service) => service.shipmentMethodIdentifier)
	}

	// There are two methods of initializing the checkout process,
	// the First one is to provide all the items we're willing to purchase manually
	// Second one is to provide a cart id and let the server fetch the items from the cart.
	//
	// Comparing to carts, the checkout process is immutable, once it's made it cannot be really changed, only voided.
	// Checkouts need a confirmation of user to be paid for, so the account is required to be logged in to make a
	// checkout.
	// In the future, we might want to add a feature to make a checkout without an account, but for now it's too
	// complicated.


	@Post()
	@ApiOperation({summary: "Initialize Checkout", operationId: 'initialize-checkout', description: "Initialization of the checkout is pre-final process of placing order in our system, the Customer is able to declare real intention to buy and we calculate the stuff for him, at the end he gets a CheckoutSummary which describes things he's going to buy and the price he's going to pay. Checkout is immutable once it's made, the only thing Customer can do when his order is not correct is cancellation of Checkout. Process itself will result in Checkout with list of CheckoutItem, draft of an Invoice and Discount."})
	@ApiBody({type: InitializeCheckout})
	@ApiOkResponse({type: CheckoutSummary})
	//@UseGuards(JwtAuthorizationGuard)
	async initialize(
		@Body() initializeCheckout: InitializeCheckout,
		@RequestIdentity() identity?: Account,
	)
	{
		this.logger.debug(`Initializing Checkout...`, initializeCheckout)

		// Before initialization of the checkout, we need to perform if user actually has a checkout
		// and if the items are available for purchase.

		let checkout: Checkout | null = null

		if (identity) {
			this.logger.debug(`Searching for existing Checkout...`, identity)

			// Query the database for the checkout
			checkout = await this.checkoutRepository.findFirst({
				where: {
					User: {
						id: identity.id
					}
				}
			})
		}

		if (checkout) {
			// If the checkout is already initialized, we need to return an error
			throw new Error('Checkout is already initialized')
		}

		let checkoutItems: ApiCheckoutItem[] = []
		let products: Product[]              = []

		// We need to check if the user is logged in
		products = await this.productRepository.findMany({
			where: {
				id: {
					in: initializeCheckout.items.map((item) => item.productId)
				}
			}
		})

		this.logger.debug(`Found products for Checkout...`, products)


		const addCheckoutItem = async (checkoutItemPayload: AddCheckoutItem): Promise<void> =>
		{
			// Fetch the product from the database
			const checkoutItemProduct = products.find((product) => product.id === checkoutItemPayload.productId)

			if (!checkoutItemProduct) {
				// Throw an error that the product is not found
				throw new ProductNotFound(checkoutItemPayload.productId)
			}

			this.logger.debug(`Calculating price for CheckoutItem...`, checkoutItemPayload)

			// There is no discount and tax functionalities yet, so we're using mockup values
			const MOCKUP_TAX = 0.23
			const MOCKUP_DISCOUNT = 0.138

			const price = dinero({ amount: checkoutItemProduct.price, currency: PLN })

			// Calculate the price of the product
			const itemSubtotal = multiply(price, checkoutItemPayload.quantity)
			this.logger.debug(`Calculated subtotal for CheckoutItem...`, {subtotal: itemSubtotal})
			const itemTax = allocate(itemSubtotal, [1 - MOCKUP_TAX, MOCKUP_TAX])[1]
			this.logger.debug(`Calculated tax for CheckoutItem...`, {tax: itemTax})
			const itemDiscount = allocate(itemSubtotal, [1 - MOCKUP_DISCOUNT, MOCKUP_DISCOUNT])[1]
			this.logger.debug(`Calculated discount for CheckoutItem...`, {discount: itemDiscount})
			const itemTotal = subtract(itemSubtotal, itemDiscount)
			this.logger.debug(`Calculated total for CheckoutItem...`, {total: itemTotal})

			checkoutItems.push({
				product: checkoutItemProduct as any,
				quantity: checkoutItemPayload.quantity,
				subtotal: itemSubtotal.toJSON().amount,
				discount: itemDiscount.toJSON().amount,
				tax: itemTax.toJSON().amount,
				total: itemTotal.toJSON().amount
			})
		}

		// We need to calculate the summary of the checkout, so we need to fetch the items and calculate the price.
		await Promise.all(initializeCheckout.items.map(addCheckoutItem))

		// After products are fine and the overall content of the checkout itself is fine, we consider it that cart was okay
		const buildSummaryOfCheckoutItems = (checkoutItems: ApiCheckoutItem[]): CheckoutSummary =>
		{
			let tax: number = 0
			let discount: number = 0
			let subtotal: number = 0
			let total: number = 0

			checkoutItems.forEach((item) => {
				total += item.total
				subtotal += item.subtotal
				discount += item.discount
				tax += item.tax
			})

			this.logger.debug(`Calculated summary of CheckoutItems...`, {total, subtotal, discount, tax})

			return {
				items: checkoutItems,
				currency: PLN.code,
				total: total
			}
		}

		const checkoutSummary = buildSummaryOfCheckoutItems(checkoutItems)

		// We can proceed with checks for payment methods and shipment methods
		let paymentMethodIdentifier: PaymentProcessor | undefined = undefined
		let paymentMethodData: CheckoutPaymentMethod[PaymentProcessor] | undefined = undefined

		this.logger.debug(`Searching for service for CheckoutPaymentMethod...`, initializeCheckout.paymentMethod)

		this.PAYMENT_METHOD_SERVICES.forEach((service) => {
			if (initializeCheckout.paymentMethod && initializeCheckout.paymentMethod[service.paymentProcessorId]) {
				paymentMethodIdentifier = service.paymentProcessorId
				paymentMethodData = initializeCheckout.paymentMethod[service.paymentProcessorId]

				this.logger.debug(`Found service for provided CheckoutPaymentMethod...`, {paymentMethodIdentifier, paymentMethodData})
			}
		})

		if (!paymentMethodIdentifier || !paymentMethodData) {
			throw new Error('No payment method provided')
		}

		// We need to check if shipment method is available and can be used by given customer
		// TODO: ...

		// We need to further validate the payment method chosen by user

		let paymentMethod: PaymentMethod

		// Prisma Query to predicate on provided payment method in body
		// and search the right payment method in a database that is attached
		// to given customer from authentication middleware.

		let paymentMethodWhereInput: Prisma.PaymentMethodWhereInput = {
			accountId: identity?.id,
			processor: paymentMethodIdentifier
		}

		if (paymentMethodIdentifier === PaymentProcessor.STRIPE) {
			const stripePaymentMethod = paymentMethodData as CheckoutStripePaymentMethod

			paymentMethodWhereInput = {
				...paymentMethodWhereInput,
				Stripe: {
					stripePaymentMethodId: stripePaymentMethod.paymentMethodId,
					stripeCustomerId: stripePaymentMethod.customerId
				}
			}
		}

		this.logger.debug(`Searching for existing PaymentMethod entity...`, paymentMethodWhereInput)

		const requestedPaymentMethod = await this.prisma.paymentMethod.findFirst({
			where: paymentMethodWhereInput
		})

		if (!requestedPaymentMethod) {
			// If a user has no payment method available, it's not possible to proceed with the checkout
			// The payment method should be added to user before actual checkout
			throw new Error('Payment method is not available for the user')
		}

		// If the payment method is in database, we assume it's fine, and we can proceed with the checkout,
		// and we can attach the payment method to the checkout.

		paymentMethod = requestedPaymentMethod

		// Further steps are related to preparing the actual payment and invoice objects
		// Idk, if discounts are added when the checkout is calculating items or somewhere else
		// at the end. Assuming discounts should be attached to single objects instead of the whole
		// checkout.

		// Invoice can happen in the future as we there do not really place a payment or anything,
		// at this point we just have a draft to confirm - so... as well they can be there or
		// they can be on finalization process - eventually on order, depending on needs and
		// requirements.

		return checkoutSummary
	}

	@Post('cart/:cardId')
	async initializeWithCart()
	{
		return 'initializeWithCart'
	}

	// Initialization of checkout is done,
	// this produced a soft-lock on the items we had in the cart - which means nobody can take products we wanted to
	// buy. User should be now able to get a summary of checkout to check price, discounts and overall whole billing
	// process.
	// Similar to carts, a user can have only one checkout at a time, which they can void at any time, until they pay
	// for it.
	// The calculation of the price should present an immutable price which user will pay now or later.

	@Get()
	async summary()
	{
		return 'summary'
	}

	// If a customer fucked something up, he can void the checkout without taking any responsibility.

	@Delete()
	@ApiOperation({summary: "Cancel Checkout", operationId: "cancel-checkout", description: "Operation will cancel the current checkout process started by user, as process is immutable once it's made - the only thing Customer can do when his order is not correct is cancellation of Checkout."})
	async void()
	{
		return 'void'
	}

	// After the user is happy with the summary, they can proceed with finalization of the checkout.

	@Post('finalize')
	async finalize()
	{
		return 'finalize'
	}

	// Finalization should always end up in Order or Subscription depending on the user's checkout.

	// Depending on the internal configuration,
	// chosen payment methods and a few other factors which are not known yet -
	// payment may happy just at this moment or in a future time (we save payment method to use it later).
	//
	// I think checkout in some cases may result in 3DS failure...
}
