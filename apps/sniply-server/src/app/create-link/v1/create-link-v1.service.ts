import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ISniplyLinkV1,
  ISniplyLinkV1Create,
  ISniplyLinkV1CreateRequest,
} from '@sniply/interfaces';
import { SNIPLY_LINK_V1_CREATE } from './create-link-v1.tokens';
import { randomBytes } from 'crypto';
import { validateHttpUrl } from '../../common/url-validation';

@Injectable()
export class CreateLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_CREATE)
    private readonly creator: ISniplyLinkV1Create,
  ) {}

  async create(request: ISniplyLinkV1CreateRequest, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    if (!request.longUrl?.trim()) {
      throw new BadRequestException('longUrl is required');
    }
    validateHttpUrl(request.longUrl);

    if (request.customAlias && request.customAlias.length > 16) {
      throw new BadRequestException('customAlias must be <= 16 characters');
    }

    const code = request.customAlias ?? this.generateCode(6);
    const now = new Date();

    const record: Partial<ISniplyLinkV1> = {
      code,
      long_url: request.longUrl,
      domain: request.domain?.trim() || null,
      expires_at: request.expiresAt ? new Date(request.expiresAt) : null,
      max_clicks: request.maxClicks ?? null,
      is_active: true,
      click_count: 0,
      password_hash: request.password ?? null,
      created_by_user_id: userId,
      created_at: now,
      updated_at: now,
    };

    const saved = await this.creator.create(record as ISniplyLinkV1);

    const baseUrl =
      process.env.SHORT_BASE_URL ?? 'https://t.yourdomain.com';
    const shortUrl = `${baseUrl.replace(/\/$/, '')}/${saved.code}`;

    return {
      id: saved.id,
      code: saved.code,
      shortUrl,
      longUrl: saved.long_url,
      expiresAt: saved.expires_at?.toISOString() ?? null,
      createdAt: saved.created_at?.toISOString() ?? null,
    };
  }

  private generateCode(length: number) {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const bytes = randomBytes(length);
    let out = '';
    for (let i = 0; i < length; i += 1) {
      out += chars[bytes[i] % chars.length];
    }
    return out;
  }
}
