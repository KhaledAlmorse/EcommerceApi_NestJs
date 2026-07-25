import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth, AuthUser } from '../Common/Decorators';
import type { IAuthUser } from '../Common/Types';
import type { Response, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileOptions } from '../Common/Utils';
import { ImagesExtensions } from '../Common/Constants/constants';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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
    @Body() body: CreateCategoryDto,
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.categoryService.createCategory(body, user, image);
    return res.status(HttpStatus.CREATED).json({
      data: result,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.categoryService.findAllCategory();
    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.categoryService.findOneCategory(id);
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
    @Body() body: UpdateCategoryDto,
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.categoryService.updateCategory(
      id,
      body,
      user,
      image,
    );
    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @Delete(':id')
  @Auth('admin')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.categoryService.removeCategory(id);
    return res.status(HttpStatus.OK).json({
      message: 'Category removed successfully',
    });
  }
}
