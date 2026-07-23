import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Product, type ProductType } from '../Models/product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RealTimeGetway } from 'src/Common/Getways/webSocket.getway';

@Injectable()
export class ProductRepository extends BaseService<ProductType> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductType>,
    private readonly realTimeGetway: RealTimeGetway,
  ) {
    super(productModel);
  }

  async decrementProductStock(products) {
    for (const product of products) {
      const isProductupdated = await this.update({
        filters: { _id: product.productId },
        body: { $inc: { stock: -product.quantity } },
      });
      if (!isProductupdated) continue;
      this.realTimeGetway.emitProductStockUpdate(
        product.productId,
        isProductupdated.stock,
      );
    }
  }
}
