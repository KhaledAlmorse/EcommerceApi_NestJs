import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';
import { IsOptional, IsString, IsMongoId } from 'class-validator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsMongoId()
  @IsOptional()
  categoryId?: string;

  @IsMongoId()
  @IsOptional()
  subCategoryId?: string;

  @IsOptional()
  image?: object;
}
