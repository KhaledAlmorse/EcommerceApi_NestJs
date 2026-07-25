import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethod } from 'src/Common/Types';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;
}
