import { IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class AddToCartDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  productId: Types.ObjectId | string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}

export class UpdateCartDto {
  @IsMongoId()
  @IsOptional()
  @Type(() => Types.ObjectId)
  productId: Types.ObjectId;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  quantity: number;
}
