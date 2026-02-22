import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { IAuthUser } from './auth-user.interface';

@Injectable()
export class JwtVerifierService {
  constructor(private readonly configService: ConfigService) {}

  verifyAccessToken(token: string): IAuthUser {
    const secret = this.configService.get<string>('AUTH_JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('AUTH_JWT_SECRET is not set');
    }

    const issuer =
      this.configService.get<string>('AUTH_JWT_ISSUER') ?? 'sniply-auth';
    const audience =
      this.configService.get<string>('AUTH_JWT_AUDIENCE') ??
      'sniply-services';

    try {
      return verify(token, secret, {
        algorithms: ['HS256'],
        issuer,
        audience,
      }) as IAuthUser;
    } catch {
      throw new UnauthorizedException('Invalid or expired bearer token');
    }
  }
}
