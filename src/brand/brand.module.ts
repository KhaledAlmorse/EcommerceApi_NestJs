import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from 'src/DB/Repositories';
import { BrandModel } from 'src/DB/Models';
import { CategoryModule } from 'src/category/category.module';
import { SubCategoryModule } from 'src/sub-category/sub-category.module';
import { UploadCloudFileService } from 'src/Common/Services';

@Module({
  imports: [BrandModel, CategoryModule, SubCategoryModule],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository, UploadCloudFileService],
})
export class BrandModule {}
