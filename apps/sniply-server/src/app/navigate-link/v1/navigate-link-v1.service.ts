import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ISniplyLinkV1Navigate } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_NAVIGATE } from './navigate-link-v1.tokens';

@Injectable()
export class NavigateLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_NAVIGATE)
    private readonly navigator: ISniplyLinkV1Navigate,
  ) {}

  async resolveAndTrack(code: string, domain?: string, password?: string) {
    const record = await this.navigator.findByCode(code, domain);
    if (!record) {
      throw new BadRequestException('Link not found');
    }

    if (!record.is_active) {
      throw new BadRequestException('Link is inactive');
    }

    if (record.expires_at && record.expires_at.getTime() <= Date.now()) {
      throw new BadRequestException('Link has expired');
    }

    if (record.max_clicks !== null && record.max_clicks !== undefined) {
      if (record.click_count >= record.max_clicks) {
        throw new BadRequestException('Link has reached max clicks');
      }
    }

    if (record.password_hash) {
      if (!password || password !== record.password_hash) {
        throw new BadRequestException('Invalid password');
      }
    }

    await this.navigator.incrementClick(record.id);

    return record.long_url;
  }
}
