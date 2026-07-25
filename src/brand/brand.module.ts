import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from '../DB/Repositories';
import { BrandModel } from '../DB/Models';
import { CategoryModule } from '../category/category.module';
import { SubCategoryModule } from '../sub-category/sub-category.module';
import { UploadCloudFileService } from '../Common/Services';

@Module({
  imports: [BrandModel, CategoryModule, SubCategoryModule],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository, UploadCloudFileService],
})
export class BrandModule {}
