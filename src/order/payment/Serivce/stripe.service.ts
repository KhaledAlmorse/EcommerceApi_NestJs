import { Injectable } from '@nestjs/common';
import { PaymentMethod } from 'src/Common/Types';
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
    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email,
      metadata,
      line_items,
      discounts,
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
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
}
