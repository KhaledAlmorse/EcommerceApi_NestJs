import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { Category } from './category.model';
import { SubCategory } from './sub-category.model';

@Schema({ timestamps: true })
export class Brand {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'Brand_name_unique_idx', unique: true },
  })
  name!: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, { lower: true, trim: true });
    },
    index: { name: 'Brand_slug_idx' },
  })
  slug!: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  addedBy: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy?: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy?: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: SubCategory.name, required: true })
  subCategoryId: string | Types.ObjectId;

  @Prop({ type: Object })
  image!: object;

  @Prop({ type: String })
  folderId!: string;
}

const BrandSchema = SchemaFactory.createForClass(Brand);

export type BrandType = HydratedDocument<Brand> & Document;

export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: BrandSchema },
]);
