import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ISniplyLinkV1Navigate } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_NAVIGATE } from './navigate-link-v1.tokens';
import { NavigateLinkV1Helper } from './navigate-link-v1.helper';

@Injectable()
export class NavigateLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_NAVIGATE)
    private readonly navigator: ISniplyLinkV1Navigate,
    private readonly helper: NavigateLinkV1Helper,
  ) {}

  async resolveAndTrack(code: string, domain?: string, password?: string) {
    const record = await this.navigator.findByCode(code, domain);
    if (!record) {
      throw new BadRequestException('Link not found');
    }

    this.helper.validate(record, password);

    await this.navigator.incrementClick(record.id);

    return record.long_url;
  }
}
