import {
  Injectable,
  NotAcceptableException,
  PipeTransform,
} from '@nestjs/common';
import { CreateProductDto } from 'src/products/dto/create-product-dto';

@Injectable()
export class CheckConfirmCodePipe implements PipeTransform {
  transform(value: CreateProductDto) {
    return value;
  }
}
