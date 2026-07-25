import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User } from './user.model';
import { Product } from './product.model';

@Schema()
export class Cart {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: Product.name, required: true },
        quantity: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 0, required: true },
      },
    ],
  })
  products: {
    productId: Types.ObjectId;
    quantity: number;
    finalPrice: number;
  }[];

  @Prop()
  subTotal: number;
}

const CartSchema = SchemaFactory.createForClass(Cart);

export type CartType = HydratedDocument<Cart> & Document;

CartSchema.pre('save', function () {
  this.subTotal = this.products.reduce(
    (total, product) => total + product.finalPrice * product.quantity,
    0,
  );
});

export const CartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: CartSchema },
]);
