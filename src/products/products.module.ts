import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from 'src/DB/Repositories';
import { ProductModel } from 'src/DB/Models';
import { CategoryModule } from 'src/category/category.module';
import { UploadCloudFileService } from 'src/Common/Services';

@Module({
  imports: [ProductModel, CategoryModule],
  providers: [ProductsService, ProductRepository, UploadCloudFileService],
  controllers: [ProductsController],
})
export class ProductsModule {}
