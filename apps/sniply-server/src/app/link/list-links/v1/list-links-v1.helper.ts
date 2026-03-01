import { Injectable } from '@nestjs/common';
import { SniplyLinkV1Entity } from '@sniply/interfaces';

@Injectable()
export class ListLinksV1Helper {
  toResponse(record: SniplyLinkV1Entity) {
    return {
      id: record.id,
      code: record.code,
      shortUrl: this.buildShortUrl(record.code),
      longUrl: record.long_url,
      expiresAt: record.expires_at?.toISOString() ?? null,
      createdAt: record.created_at?.toISOString() ?? null,
    };
  }

  private buildShortUrl(code: string) {
    const baseUrl = process.env.SHORT_BASE_URL ?? 'https://t.yourdomain.com';
    return `${baseUrl.replace(/\/$/, '')}/${code}`;
  }
}
