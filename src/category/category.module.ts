import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository, ProductRepository } from 'src/DB/Repositories';
import {
  CategoryModel,
  ProductModel,
  SubCategoryModel,
  BrandModel,
} from 'src/DB/Models';
import { UploadCloudFileService } from 'src/Common/Services';

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
