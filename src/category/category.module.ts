import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository, ProductRepository } from '../DB/Repositories';
import {
  CategoryModel,
  ProductModel,
  SubCategoryModel,
  BrandModel,
} from '../DB/Models';
import { UploadCloudFileService } from '../Common/Services';

@Module({
  imports: [CategoryModel, ProductModel, SubCategoryModel, BrandModel],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    CategoryRepository,
    UploadCloudFileService,
    ProductRepository,
  ],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
