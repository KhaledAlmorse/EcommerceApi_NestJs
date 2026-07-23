import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth, AuthUser } from 'src/Common/Decorators';
import type { IAuthUser } from 'src/Common/Types';
import { AddToCartDto } from './dto/cart.dto';
import type { Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @Auth('user')
  async addToCart(
    @Body() body: AddToCartDto,
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
  ) {
    const resutl = await this.cartService.AddProductToCart(body, user);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      resutl,
    });
  }

  @Patch('romove-from-cart/:id')
  @Auth('user')
  async removeFromCart(
    @Param('id') id: string,
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
  ) {
    const result = await this.cartService.RemoveProductFromCart(id, user);
    return res.status(HttpStatus.OK).json({
      success: true,
      result,
    });
  }

  @Get('get-cart')
  @Auth('user')
  async getCurrentCart(@AuthUser() user: IAuthUser, @Res() res: Response) {
    const result = await this.cartService.getCurrentCart(user);
    return res.status(HttpStatus.OK).json({
      success: true,
      result,
    });
  }

  @Patch('update-cart-quantity')
  @Auth('user')
  async updateCartQuantity(
    @Body() body: { productId: string; quantity: number },
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
  ) {
    const result = await this.cartService.updateProductQuantityInCart(
      body.productId,
      user,
      body.quantity,
    );
    return res.status(HttpStatus.OK).json({
      success: true,
      result,
    });
  }
}
