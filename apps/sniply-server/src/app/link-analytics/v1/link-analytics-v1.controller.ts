import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { IAuthRequest } from '@sniply/authentication';
import { LinkAnalyticsV1Service } from './link-analytics-v1.service';

@Controller('links')
export class LinkAnalyticsV1Controller {
  constructor(private readonly service: LinkAnalyticsV1Service) {}

  @Get(':code/analytics')
  getAnalytics(
    @Param('code') code: string,
    @Req() req: IAuthRequest,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.service.getAnalytics(code, req.authUser?.sub, from, to);
  }
}
