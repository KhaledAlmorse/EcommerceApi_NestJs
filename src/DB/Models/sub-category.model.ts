import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';
import { Category } from './category.model';

@Schema({ timestamps: true })
export class SubCategory {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'SubCategory_name_unique_idx', unique: true },
  })
  name!: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, { lower: true, trim: true });
    },
    index: { name: 'SubCategory_slug_idx' },
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

  @Prop({ type: Object })
  image!: object;

  @Prop({ type: String })
  folderId!: string;
}

const SubCategorySchema = SchemaFactory.createForClass(SubCategory);

export type SubCategoryType = HydratedDocument<SubCategory> & Document;

export const SubCategoryModel = MongooseModule.forFeature([
  { name: SubCategory.name, schema: SubCategorySchema },
]);
