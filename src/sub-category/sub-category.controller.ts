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
import { SubCategoryService } from './sub-category.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Auth, AuthUser } from 'src/Common/Decorators';
import type { IAuthUser } from 'src/Common/Types';
import type { Response, Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileOptions } from 'src/Common/Utils';
import { ImagesExtensions } from 'src/Common/Constants/constants';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

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
    @Body() body: CreateSubCategoryDto,
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.subCategoryService.createSubCategory(
      body,
      user,
      image,
    );
    return res.status(HttpStatus.CREATED).json({
      data: result,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.subCategoryService.findAllSubCategory();
    return res.status(HttpStatus.OK).json({
      data: result,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.subCategoryService.findOneSubCategory(id);
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
    @Body() body: UpdateSubCategoryDto,
    @AuthUser() user: IAuthUser,
    @Res() res: Response,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const result = await this.subCategoryService.updateSubCategory(
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
    const result = await this.subCategoryService.removeSubCategory(id);
    return res.status(HttpStatus.OK).json({
      message: 'SubCategory removed successfully',
    });
  }
}
