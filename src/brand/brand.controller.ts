import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Auth, AuthUser } from '../Common/Decorators';
import type { IAuthUser } from '../Common/Types';
import type { Response, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileOptions } from '../Common/Utils';
import { ImagesExtensions } from '../Common/Constants/constants';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Auth('admin')
  @UseInterceptors(
    FileInterceptor(
      'image',
      uploadFileOptions({
        allowedFileType: ImagesExtensions,
      }),
    ),
  )
  async create(
    @Body() body: CreateBrandDto,
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.brandService.createBrand(body, user, image);
    return res.status(HttpStatus.CREATED).json({
      data: result,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.brandService.findAllBrand();
    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.brandService.findOneBrand(id);
    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @Patch(':id')
  @Auth('admin')
  @UseInterceptors(
    FileInterceptor(
      'image',
      uploadFileOptions({ allowedFileType: ImagesExtensions }),
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() body: UpdateBrandDto,
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.brandService.updateBrand(id, body, user, image);
    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @Delete(':id')
  @Auth('admin')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.brandService.removeBrand(id);
    return res.status(HttpStatus.OK).json({
      message: 'Brand removed successfully',
    });
  }
}
