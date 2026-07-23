import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';
import { User } from './user.model';

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: { name: 'Category_name_unique_idx', unique: true },
  })
  name!: string;

  @Prop({
    type: String,
    default: function () {
      return slugify(this.name, { lower: true, trim: true });
    },
    index: { name: 'Category_slug_idx' },
  })
  slug!: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  addedBy: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy?: string | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy?: string | Types.ObjectId;

  @Prop({ type: Object })
  image!: object;

  @Prop({ type: String })
  folderId!: string;
}

const CategorySchema = SchemaFactory.createForClass(Category);

export type CategoryType = HydratedDocument<Category> & Document;

export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);
