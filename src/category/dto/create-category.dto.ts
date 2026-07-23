import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  name!: string;
}
