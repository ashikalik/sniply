import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ISniplyLinkV1Analytics } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_ANALYTICS } from './link-analytics-v1.tokens';

@Injectable()
export class LinkAnalyticsV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_ANALYTICS)
    private readonly analytics: ISniplyLinkV1Analytics,
  ) {}

  async getAnalytics(
    code: string,
    userId?: string,
    from?: string,
    to?: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    if (!code?.trim()) {
      throw new BadRequestException('code is required');
    }

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    if (fromDate && Number.isNaN(fromDate.getTime())) {
      throw new BadRequestException('from is invalid');
    }
    if (toDate && Number.isNaN(toDate.getTime())) {
      throw new BadRequestException('to is invalid');
    }
    if (fromDate && toDate && fromDate > toDate) {
      throw new BadRequestException('from must be <= to');
    }

    return this.analytics.getByCode(code, userId, fromDate, toDate);
  }
}
