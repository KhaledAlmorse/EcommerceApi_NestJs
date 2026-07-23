import { Type } from 'class-transformer';
import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SortOrder, Types } from 'mongoose';

@ValidatorConstraint({ name: 'dicount-base-price', async: false })
export class DiscountLessThanBasePriceValidator implements ValidatorConstraintInterface {
  validate(discount: number, data?: ValidationArguments) {
    return discount <= data?.object['basePrice'];
  }
  defaultMessage(): string {
    return 'discount must be less than or equal to base price';
  }
}
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1000)
  description: string;

  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  folderId: string;

  @IsMongoId()
  @IsOptional()
  @Type(() => Types.ObjectId)
  updatedBy: string | Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  @Type(() => Types.ObjectId)
  deletedBy: string | Types.ObjectId;

  @IsMongoId()
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  categoryId: string | Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  basePrice: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Validate(DiscountLessThanBasePriceValidator)
  discount: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  finalPrice: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  stock: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  overallRating: number;
}

export class listProductQueryDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  limit: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page: number;

  @IsString()
  @IsOptional()
  sort: { [key: string]: SortOrder };
}
