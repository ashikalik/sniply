import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign, verify } from 'jsonwebtoken';

export interface IAuthAccessTokenPayload {
  sub: string;
  sid: string;
  email: string;
  iss: string;
  aud: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthJwtService {
  constructor(private readonly configService: ConfigService) {}

  createAccessToken(input: { sub: string; sid: string; email: string }) {
    const secret = this.getSecret();
    const issuer = this.getIssuer();
    const audience = this.getAudience();
    const expiresIn = Number(
      this.configService.get<string>('AUTH_ACCESS_TTL_SEC') ?? '900',
    );

    const token = sign(
      {
        sub: input.sub,
        sid: input.sid,
        email: input.email,
      },
      secret,
      {
        algorithm: 'HS256',
        expiresIn,
        issuer,
        audience,
      },
    );

    return {
      token,
      expiresIn,
    };
  }

  verifyAccessToken(token: string): IAuthAccessTokenPayload {
    const secret = this.getSecret();
    const issuer = this.getIssuer();
    const audience = this.getAudience();

    try {
      return verify(token, secret, {
        algorithms: ['HS256'],
        issuer,
        audience,
      }) as IAuthAccessTokenPayload;
    } catch {
      throw new UnauthorizedException('Invalid or expired bearer token');
    }
  }

  private getSecret() {
    const secret = this.configService.get<string>('AUTH_JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('AUTH_JWT_SECRET is not set');
    }
    return secret;
  }

  private getIssuer() {
    return this.configService.get<string>('AUTH_JWT_ISSUER') ?? 'sniply-auth';
  }

  private getAudience() {
    return (
      this.configService.get<string>('AUTH_JWT_AUDIENCE') ?? 'sniply-services'
    );
  }
}
