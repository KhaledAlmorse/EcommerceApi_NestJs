import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { RevokeTokenRepository, UserRepository } from '../../DB/Repositories';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    // @Inject(forwardRef(() => RevokeTokenRepository))
    private readonly revokeTokenRepository: RevokeTokenRepository,
  ) {}

  generate(payload: object, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  verify(token: string, options?: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }

  async ValidateAndVerifyToken(accessToken: string) {
    const decoded = this.verify(accessToken, {
      secret: process.env.ACCESS_TOKEN_SECRET as string,
    });

    const isTokenRevoked = await this.revokeTokenRepository.findOne({
      filters: { tokenId: decoded.jti },
    });

    if (isTokenRevoked) {
      throw new UnauthorizedException('Token has been revoked');
    }

    const { id } = decoded as { id: string };
    const user = await this.userRepository.findOne({ filters: { _id: id } });
    if (!user) {
      throw new NotFoundException('User not found, please Login ');
    }

    return { user, decoded };
  }
}
