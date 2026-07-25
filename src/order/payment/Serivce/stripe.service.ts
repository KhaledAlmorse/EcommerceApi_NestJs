import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '../../../Common/Types';
import Stripe, { CouponCreateParams } from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  async createCheckOutSession({
    customer_email,
    metadata,
    line_items,
    discounts = [],
  }: Stripe.Checkout.SessionCreateParams) {
    const baseUrl =
      process.env.APP_URL ||
      'https://ecommerce-api-nest-mcq9wuf79-khaledalmorses-projects.vercel.app';
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email,
      metadata,
      line_items,
      discounts,
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
    });
  }

  async createStripeCoupon({
    amount_off,
    currency,
    percent_off,
  }: CouponCreateParams) {
    return await this.stripe.coupons.create({
      amount_off,
      currency,
      percent_off,
    });
  }

  constructEvent(data: any, sig?: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && sig) {
      return this.stripe.webhooks.constructEvent(data, sig, webhookSecret);
    }
    if (typeof data === 'string') {
      return JSON.parse(data) as Stripe.Event;
    }
    return data as Stripe.Event;
  }
}
