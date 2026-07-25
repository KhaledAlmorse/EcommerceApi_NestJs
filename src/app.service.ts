import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  @Get('success')
  StripeSuccessUrl() {
    return 'Order created successfully';
  }

  @Get('cancel')
  StripeCancelUrl() {
    return 'Order cancelled';
  }
}
