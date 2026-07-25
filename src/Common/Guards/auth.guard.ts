import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '../Services';
import { RevokeTokenRepository, UserRepository } from '../../DB/Repositories';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
    private readonly revokeTokenRepository: RevokeTokenRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers['authorization']?.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('No token provided, please Login ');
      }

      const { user, decoded } =
        await this.tokenService.ValidateAndVerifyToken(token);

      request.user = { user, token: decoded };
      request.accessToken = decoded;
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Invalid token, please Login ');
    }
  }
}
