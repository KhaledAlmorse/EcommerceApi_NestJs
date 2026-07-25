import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  listProductQueryDto,
} from './dto/create-product-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { Auth, AuthUser } from '../Common/Decorators';
import { FilesInterceptor } from '@nestjs/platform-express';
import { uploadFileOptions } from '../Common/Utils';
import { ImagesExtensions } from '../Common/Constants/constants';
import type { IAuthUser } from '../Common/Types';
import type { Request, Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productServices: ProductsService) {}

  @Post()
  @Auth('admin')
  @UseInterceptors(
    FilesInterceptor(
      'images',
      3,
      uploadFileOptions({ allowedFileType: ImagesExtensions }),
    ),
  )
  async createProductHandler(
    @Body() body: CreateProductDto,
    @AuthUser() user: IAuthUser,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    const result = await this.productServices.createProduct(body, user, images);
    res.status(HttpStatus.CREATED).json(result);
  }

  @Get()
  async findAllProductsHandler(@Res() res: Response, @Req() req: Request) {
    const result = await this.productServices.findAllProducts(
      req['parseQuery'],
    );
    // console.log(req['parseQuery']);
    res.status(HttpStatus.OK).json(result);
  }

  @Get('/:id')
  async getSingleProductHandler(@Param('id') id: string, @Res() res: Response) {
    const result = await this.productServices.findProduct(id);
    res.status(HttpStatus.OK).json(result);
  }
}
