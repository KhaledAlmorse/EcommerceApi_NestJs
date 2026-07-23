import { IsNotEmpty, MaxLength, MinLength, IsMongoId } from 'class-validator';

export class CreateSubCategoryDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name!: string;

  @IsNotEmpty()
  @IsMongoId()
  categoryId!: string;
}
