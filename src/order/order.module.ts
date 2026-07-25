import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderModel } from '../DB/Models';
import { OrderRepository } from '../DB/Repositories';
import { CartService } from '../cart/cart.service';
import { CartModel, ProductModel } from '../DB/Models';
import { CartRepository, ProductRepository } from '../DB/Repositories';
import { StripeService } from './payment/Serivce';

@Module({
  imports: [OrderModel, CartModel, ProductModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    StripeService,
    CartService,
    CartRepository,
    ProductRepository,
  ],
})
export class OrderModule {}
