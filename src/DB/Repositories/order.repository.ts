import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Order, type OrderType } from '../Models/order.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderStatus, PaymentMethod } from 'src/Common/Types';

@Injectable()
export class OrderRepository extends BaseService<OrderType> {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderType>,
  ) {
    super(orderModel);
  }

  async createOrder(data) {
    const orderStatus =
      data.paymentMethod === PaymentMethod.CASH
        ? OrderStatus.PLACED
        : OrderStatus.PENDING;

    const newOrder = await this.orderModel.create({
      userId: new Types.ObjectId(data.userId),
      cartId: new Types.ObjectId(data.cartId),
      totalAmount: data.totalAmount,
      address: data.address,
      phone: data.phone,
      paymentMethod: data.paymentMethod,
      orderStatus,
    });

    return newOrder;
  }
}
