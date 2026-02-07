import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ISniplyLinkClickV1,
  ISniplyLinkV1ClickCreate,
  ISniplyLinkV1Navigate,
} from '@sniply/interfaces';
import {
  SNIPLY_LINK_V1_CLICK_CREATE,
  SNIPLY_LINK_V1_NAVIGATE,
} from './navigate-link-v1.tokens';
import { NavigateLinkV1Helper } from './navigate-link-v1.helper';
import { createHash, randomUUID } from 'crypto';

type NavigateLinkV1Context = {
  domain?: string;
  password?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  deviceType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  requestId?: string;
};

@Injectable()
export class NavigateLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_NAVIGATE)
    private readonly navigator: ISniplyLinkV1Navigate,
    @Inject(SNIPLY_LINK_V1_CLICK_CREATE)
    private readonly clickCreator: ISniplyLinkV1ClickCreate,
    private readonly helper: NavigateLinkV1Helper,
  ) {}

  async resolveAndTrack(code: string, context: NavigateLinkV1Context) {
    const record = await this.navigator.findByCode(code, context.domain);
    if (!record) {
      throw new BadRequestException('Link not found');
    }

    this.helper.validate(record, context.password);

    void this.navigator
      .incrementClick(record.id)
      .catch((err) => this.logAsyncError('incrementClick', err));
    void this.clickCreator
      .create(this.buildClickEvent(record.id, context))
      .catch((err) => this.logAsyncError('createClick', err));

    return record.long_url;
  }

  private buildClickEvent(
    linkId: string,
    context: NavigateLinkV1Context,
  ): ISniplyLinkClickV1 {
    const ipHash = this.hashValue(context.ip ?? '');
    return {
      short_link_id: linkId,
      ip_hash: ipHash,
      user_agent: context.userAgent ?? '',
      referrer: context.referrer ?? '',
      country: context.country ?? null,
      device_type: context.deviceType ?? null,
      utm_source: context.utmSource ?? null,
      utm_medium: context.utmMedium ?? null,
      utm_campaign: context.utmCampaign ?? null,
      utm_term: context.utmTerm ?? null,
      utm_content: context.utmContent ?? null,
      request_id: context.requestId ?? randomUUID(),
    };
  }

  private hashValue(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private logAsyncError(action: string, err: unknown) {
    // eslint-disable-next-line no-console
    console.error(`[NavigateLinkV1Service] ${action} failed`, err);
  }
}
