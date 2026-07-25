import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IAuthUser } from 'src/Common/Types';
import { CartRepository, ProductRepository } from 'src/DB/Repositories';
import { AddToCartDto } from './dto/cart.dto';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRespository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async AddProductToCart(body: AddToCartDto, authUser: IAuthUser) {
    const { productId, quantity } = body;
    const userId = authUser.user._id;

    const isValidProductId = await this.productRepository.findOne({
      filters: { _id: productId },
    });

    if (!isValidProductId) {
      throw new NotFoundException('Product not found');
    }

    if (quantity > isValidProductId.stock) {
      throw new BadRequestException('Product quantity is not enough');
    }

    const userCart = await this.cartRespository.findOne({
      filters: { userId },
    });

    if (!userCart) {
      await this.cartRespository.create({
        userId,
        products: [
          {
            productId: new Types.ObjectId(productId),
            quantity,
            finalPrice: isValidProductId.finalPrice,
          },
        ],
      });
      await this.productRepository.decrementProductStock([
        { productId, quantity },
      ]);
      return 'Product added to cart successfully';
    }

    const isProductAlreadyAdded = userCart.products.find((p) =>
      p.productId.equals(productId),
    );
    if (isProductAlreadyAdded) {
      throw new BadRequestException('Product already added to cart');
    }

    userCart.products.push({
      productId: new Types.ObjectId(productId),
      quantity,
      finalPrice: isValidProductId.finalPrice,
    });

    await this.cartRespository.save(userCart);
    await this.productRepository.decrementProductStock([
      { productId, quantity },
    ]);
    return 'Product added to cart successfully';
  }

  async RemoveProductFromCart(productId: string, authUser: IAuthUser) {
    const userId = authUser.user._id;

    const product = await this.productRepository.findOne({
      filters: { _id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const userCart = await this.cartRespository.findOne({
      filters: { userId, 'products.productId': productId },
    });
    if (!userCart) {
      throw new NotFoundException('Cart not found');
    }

    userCart.products = userCart.products.filter(
      (p) => !p.productId.equals(productId),
    );
    await this.cartRespository.save(userCart);
    return 'Product removed from cart successfully';
  }

  async updateProductQuantityInCart(
    productId: string,
    authUser: IAuthUser,
    newQuantity: number,
  ) {
    const userId = authUser.user._id;

    const product = await this.productRepository.findOne({
      filters: { _id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const userCart = await this.cartRespository.findOne({
      filters: { userId, 'products.productId': productId },
    });
    if (!userCart) {
      throw new NotFoundException('Cart not found');
    }
    if (newQuantity > product.stock) {
      throw new BadRequestException('Product quantity is not enough');
    }

    userCart.products = userCart.products.map((p) => {
      if (p.productId.equals(productId)) {
        p.quantity = newQuantity;
        p.finalPrice = product.finalPrice * newQuantity;
      }
      return p;
    });
    await this.cartRespository.save(userCart);
    return 'Product quantity updated successfully';
  }

  async getCurrentCart(authUser: IAuthUser) {
    const userId = authUser.user._id;
    const userCart = await this.cartRespository.findOne({
      filters: { userId },
      select: 'products subTotal',
    });
    if (!userCart) {
      throw new NotFoundException('Cart not found');
    }
    return userCart;
  }
}
