import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ISniplyLinkV1Read } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_READ } from './read-link-v1.tokens';

@Injectable()
export class ReadLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_READ)
    private readonly reader: ISniplyLinkV1Read,
  ) {}

  async findByCode(code: string) {
    const record = await this.reader.findByCode(code);
    if (!record) {
      throw new BadRequestException('Link not found');
    }

    const baseUrl =
      process.env.SHORT_BASE_URL ?? 'https://t.yourdomain.com';
    const shortUrl = `${baseUrl.replace(/\/$/, '')}/${record.code}`;

    return {
      id: record.id,
      code: record.code,
      shortUrl,
      longUrl: record.long_url,
      expiresAt: record.expires_at?.toISOString() ?? null,
      createdAt: record.created_at?.toISOString() ?? null,
    };
  }
}
