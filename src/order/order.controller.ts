import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  HttpStatus,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
import * as express from 'express';
import { Auth, AuthUser } from '../Common/Decorators';
import { RolesEnum, type IAuthUser } from '../Common/Types';
import { Types } from 'mongoose';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Auth(RolesEnum.USER)
  async createOrderHandler(
    @Body() body: CreateOrderDto,
    @Res() res: express.Response,
    @AuthUser() user: IAuthUser,
  ) {
    const result = await this.orderService.CreateOrderService(user, body);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      result,
    });
  }

  @Post('pay-with-stripe')
  @Auth(RolesEnum.USER)
  async payWithStripeHandler(
    @Body() body: { orderId: Types.ObjectId },
    @Res() res: express.Response,
    @AuthUser() user: IAuthUser,
  ) {
    const result = await this.orderService.PayWithStripe(body.orderId, user);
    return res.status(HttpStatus.OK).json({
      success: true,
      result,
    });
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: any,
    @Body() data: any,
    @Headers('stripe-signature') sig?: string,
  ) {
    const payload = req?.rawBody || data;
    return await this.orderService.handleWebhook(payload, sig);
  }
}
