import { Injectable } from '@nestjs/common';
import { ISniplyLinkV1 } from '@sniply/interfaces';
import { buildShortUrl } from '../../../common/short-url';

@Injectable()
export class ReadLinkV1Helper {
  toResponse(record: ISniplyLinkV1) {
    const shortUrl = this.buildShortUrl(record.code);

    return {
      id: record.id,
      code: record.code,
      shortUrl,
      longUrl: record.long_url,
      expiresAt: record.expires_at?.toISOString() ?? null,
      createdAt: record.created_at?.toISOString() ?? null,
    };
  }

  private buildShortUrl(code: string) {
    return buildShortUrl(code);
  }
}
