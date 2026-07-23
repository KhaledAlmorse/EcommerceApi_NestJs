import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-sub-category.dto';
import { IsOptional, IsString, IsMongoId } from 'class-validator';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @IsOptional()
  image?: object;
}
