import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { IAuthRequest } from '@sniply/authentication';
import { QrCodeAnalyticsV1Service } from './qr-code-analytics-v1.service';

@Controller('qr-codes')
export class QrCodeAnalyticsV1Controller {
  constructor(private readonly service: QrCodeAnalyticsV1Service) {}

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
