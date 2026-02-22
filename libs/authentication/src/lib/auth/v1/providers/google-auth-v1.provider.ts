import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import {
  IExternalAuthV1Identity,
  IExternalAuthV1Provider,
} from './external-auth-provider-v1.interface';

@Injectable()
export class GoogleAuthV1Provider implements IExternalAuthV1Provider {
  readonly provider = 'google';

  constructor(private readonly configService: ConfigService) {}

  async verify(idToken: string): Promise<IExternalAuthV1Identity> {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      throw new InternalServerErrorException('GOOGLE_CLIENT_ID is not set');
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Invalid Google token payload');
    }

    return {
      provider: this.provider,
      providerUserId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified ?? false,
      displayName: payload.name ?? null,
    };
  }
}
