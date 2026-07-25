import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';
import { User } from './user.model';
import { Cart } from './cart.model';
import { OrderStatus, PaymentMethod } from '../../Common/Types';

export type OrderType = HydratedDocument<Order> & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Cart.name, required: true })
  cartId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ type: String, enum: OrderStatus, required: true })
  orderStatus: OrderStatus;

  @Prop({
    type: Date,
    default: function () {
      return new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    },
  })
  arrivedAt: Date;

  @Prop({
    type: {
      paidAt: Date,
      deliveredAt: Date,
      deliveredBy: { type: Types.ObjectId, ref: User.name },
      cancelledAt: Date,
      cancelledBy: { type: Types.ObjectId, ref: User.name },
      refundedAt: Date,
      refundedBy: { type: Types.ObjectId, ref: User.name },
    },
  })
  orderChanges: object;
}

const orderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: orderSchema },
]);
