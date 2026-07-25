import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { CartRepository, OrderRepository } from 'src/DB/Repositories';
import { CartService } from 'src/cart/cart.service';
import { OrderStatus, type IAuthUser } from 'src/Common/Types';
import { Types } from 'mongoose';
import { StripeService } from './payment/Serivce';

@Injectable()
export class OrderService {
  constructor(
    private readonly cartService: CartService,
    private readonly orderRespository: OrderRepository,
    private readonly stripeService: StripeService,
  ) {}
  async CreateOrderService(authUser: IAuthUser, data: CreateOrderDto) {
    const cartData = await this.cartService.getCurrentCart(authUser);

    if (!cartData) throw new BadRequestException('Cart is empty');

    const order = await this.orderRespository.createOrder({
      userId: authUser.user._id,
      cartId: cartData._id,
      totalAmount: cartData.subTotal,
      address: data.address,
      phone: data.phone,
      paymentMethod: data.paymentMethod,
    });

    if (!order) throw new BadRequestException('Failed to create order');

    return order;
  }

  async PayWithStripe(orderId: Types.ObjectId, user: IAuthUser) {
    const order = await this.orderRespository.findOne({
      filters: {
        _id: orderId,
        userId: user.user._id,
        orderStatus: OrderStatus.PENDING,
      },
      populationArray: [
        {
          path: 'cartId',
          select: 'products subTotal',
          populate: [
            {
              path: 'products.productId',
              select: 'title finalPrice',
            },
          ],
        },
      ],
    });

    if (
      !order ||
      !order.cartId ||
      !order.cartId['products'] ||
      order.cartId['products'].length === 0
    ) {
      throw new BadRequestException(
        'You are not allowed to pay for this order',
      );
    }

    // return order;
    const line_items = order.cartId['products'].map((product) => {
      return {
        price_data: {
          currency: 'EGP',
          product_data: {
            name: product.productId.title,
          },
          unit_amount: product.productId.finalPrice * 100,
        },
        quantity: product.quantity,
      };
    });

    const coupon = await this.stripeService.createStripeCoupon({
      amount_off: 1000 * 100,
      currency: 'EGP',
    });

    return await this.stripeService.createCheckOutSession({
      customer_email: user.user.email,
      metadata: {
        orderId: order._id.toString(),
      },
      line_items,
      discounts: [{ coupon: coupon.id }],
    });
  }
}
