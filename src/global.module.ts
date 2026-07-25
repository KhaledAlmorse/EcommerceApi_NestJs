import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './Common/Services';
import { RevokeTokenModel, UserModel } from './DB/Models';
import { RevokeTokenRepository, UserRepository } from './DB/Repositories';
import { GetwayModule } from './Common/Getways/getway.module';

@Global()
@Module({
  imports: [UserModel, RevokeTokenModel, GetwayModule],
  providers: [UserRepository, RevokeTokenRepository, TokenService, JwtService],
  exports: [
    UserModel,
    RevokeTokenModel,
    UserRepository,
    RevokeTokenRepository,
    TokenService,
    JwtService,
    GetwayModule,
  ],
})
export class GlobalAuthModule {}
