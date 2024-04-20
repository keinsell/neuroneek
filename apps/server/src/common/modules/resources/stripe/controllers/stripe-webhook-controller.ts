import {
  Controller,
  Headers,
  Post,
  Req,
}                                   from '@nestjs/common'
import type { Request }             from 'express'
import { InjectStripeModuleConfig } from '../decorators/stripe-decorator.js'
import type { StripeModuleConfig }  from '../interfaces/stripe-interface.js'
import { StripePayloadService }     from '../services/stripe-payload-service.js'
import { StripeWebhookService }     from '../services/stripe-webhook-service.js'



@Controller( '/stripe' )
export class StripeWebhookController
  {


	 constructor(
		@InjectStripeModuleConfig() private readonly config : StripeModuleConfig,
		private readonly stripePayloadService : StripePayloadService,
		private readonly stripeWebhookService : StripeWebhookService,
	 )
		{
		}


	 @Post( '/webhook' )
	 async handleWebhook(
		@Headers( 'stripe-signature' ) sig : string,
		@Req() request : Request,
	 )
		{
		  if ( !sig )
			 {
				throw new Error( 'Missing stripe-signature header' )
			 }
		  const rawBody = request.body

		  const event = this.stripePayloadService.tryHydratePayload( sig, rawBody )

		  await this.stripeWebhookService.handleWebhook( event )
		}
  }