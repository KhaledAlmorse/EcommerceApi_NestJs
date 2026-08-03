import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { GlobalAuthModule } from './global.module';
import { CartModule } from './cart/cart.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { BrandModule } from './brand/brand.module';
import { OrderModule } from './order/order.module';
import { CoreModule } from './Core/core.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL as string),
    ProductsModule,
    AuthModule,
    CategoryModule,
    GlobalAuthModule,
    CartModule,
    SubCategoryModule,
    BrandModule,
    OrderModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
