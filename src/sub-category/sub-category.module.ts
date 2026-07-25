import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryRepository } from '../DB/Repositories';
import { SubCategoryModel } from '../DB/Models';
import { CategoryModule } from '../category/category.module';
import { UploadCloudFileService } from '../Common/Services';

@Module({
  imports: [SubCategoryModel, CategoryModule],
  controllers: [SubCategoryController],
  providers: [
    SubCategoryService,
    SubCategoryRepository,
    UploadCloudFileService,
  ],
  exports: [SubCategoryService, SubCategoryRepository],
})
export class SubCategoryModule {}
