import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryRepository } from 'src/DB/Repositories';
import { SubCategoryModel } from 'src/DB/Models';
import { CategoryModule } from 'src/category/category.module';
import { UploadCloudFileService } from 'src/Common/Services';

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
