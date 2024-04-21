import { SetMetadata }             from '@nestjs/common'
import Stripe                      from 'stripe'
import {
  STRIPE_CLIENT_TOKEN,
  STRIPE_MODULE_CONFIG_TOKEN,
  STRIPE_WEBHOOK_HANDLER,
}                                  from '../constraints/stripe-constraints.js'
import { makeInjectableDecorator } from './make-injectable-decorator.js'



/**
 * Injects the Stripe Module config
 */
export const InjectStripeModuleConfig = makeInjectableDecorator( STRIPE_MODULE_CONFIG_TOKEN )

/**
 * Injects the Stripe Client instance
 */
export const InjectStripeClient = makeInjectableDecorator( STRIPE_CLIENT_TOKEN )

/**
 * Binds the decorated service method as a handler for incoming Stripe Webhook events.
 * Events will be automatically routed here based on their event type property
 * @param eventType
 */
export const StripeWebhookHandler = (eventType : Stripe.WebhookEndpointCreateParams.EnabledEvent) => SetMetadata(
  STRIPE_WEBHOOK_HANDLER, eventType )