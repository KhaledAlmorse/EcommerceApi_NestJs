import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from '../DB/Repositories';
import { ProductModel } from '../DB/Models';
import { CategoryModule } from '../category/category.module';
import { UploadCloudFileService } from '../Common/Services';

@Module({
  imports: [ProductModel, CategoryModule],
  providers: [ProductsService, ProductRepository, UploadCloudFileService],
  controllers: [ProductsController],
})
export class ProductsModule {}
