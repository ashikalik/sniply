import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ISniplyLinkV1,
  ISniplyLinkV1Update,
  ISniplyLinkV1UpdateRequest,
} from '@sniply/interfaces';
import { SNIPLY_LINK_V1_UPDATE } from './update-link-v1.tokens';

@Injectable()
export class UpdateLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_UPDATE)
    private readonly updater: ISniplyLinkV1Update,
  ) {}

  async update(code: string, request: ISniplyLinkV1UpdateRequest) {
    if (!code?.trim()) {
      throw new BadRequestException('code is required');
    }

    if (request.longUrl !== undefined && !request.longUrl.trim()) {
      throw new BadRequestException('longUrl cannot be empty');
    }

    const patch: Partial<ISniplyLinkV1> = {};
    if (request.longUrl !== undefined) {
      patch.long_url = request.longUrl;
    }
    if (request.expiresAt !== undefined) {
      patch.expires_at = request.expiresAt
        ? new Date(request.expiresAt)
        : null;
    }
    if (request.isActive !== undefined) {
      patch.is_active = request.isActive;
    }

    const updated = await this.updater.updateByCode(code, patch);
    if (!updated) {
      throw new BadRequestException('Link not found');
    }

    const baseUrl =
      process.env.SHORT_BASE_URL ?? 'https://t.yourdomain.com';
    const shortUrl = `${baseUrl.replace(/\/$/, '')}/${updated.code}`;

    return {
      id: updated.id,
      code: updated.code,
      shortUrl,
      longUrl: updated.long_url,
      expiresAt: updated.expires_at?.toISOString() ?? null,
      createdAt: updated.created_at?.toISOString() ?? null,
    };
  }
}
