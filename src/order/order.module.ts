import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderModel } from 'src/DB/Models';
import { OrderRepository } from 'src/DB/Repositories';
import { CartService } from 'src/cart/cart.service';
import { CartModel, ProductModel } from 'src/DB/Models';
import { CartRepository, ProductRepository } from 'src/DB/Repositories';
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
