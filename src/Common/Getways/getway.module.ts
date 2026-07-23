import { Module } from '@nestjs/common';
import { RealTimeGetway } from './webSocket.getway';

@Module({
  providers: [RealTimeGetway],
  exports: [RealTimeGetway],
})
export class GetwayModule {}
