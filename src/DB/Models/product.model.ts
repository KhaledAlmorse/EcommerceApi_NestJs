import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { Category } from './category.model';

@Schema({ timestamps: true })
export class Product {
  @Prop({
    type: String,
    required: true,
    trim: true,
    index: { name: 'Product_title_idx', unique: true },
  })
  title: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.title, { lower: true, trim: true });
    },
  })
  slug: string;

  @Prop({
    type: String,
    trim: true,
  })
  description: string;

  @Prop({
    type: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  })
  images: {
    secure_url: string;
    public_id: string;
  }[];

  @Prop({ type: String, required: true })
  folderId: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  addedBy: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy?: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy?: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: string | Types.ObjectId;

  //TODO: subcategoryId and brandId

  @Prop({ type: Number, required: true })
  basePrice: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({
    type: Number,
    default: function () {
      if (this.discount > 0)
        return this.basePrice - this.basePrice * (this.discount / 100);
      else return this.basePrice;
    },
  })
  finalPrice: number;

  @Prop({ type: Number, required: true, min: 1 })
  stock: number;

  @Prop({ type: Number, default: 0 })
  overallRating: number;
}

const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductType = HydratedDocument<Product> & Document;

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);
