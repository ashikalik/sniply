import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { Public } from '@sniply/authentication';
import { NavigateQrCodeV1Service } from './navigate-qr-code-v1.service';

@Controller('q')
export class NavigateQrCodeV1Controller {
  constructor(private readonly service: NavigateQrCodeV1Service) {}

  @Public()
  @Get(':code')
  async navigate(
    @Param('code') code: string,
    @Query('utm_source') utmSource: string | undefined,
    @Query('utm_medium') utmMedium: string | undefined,
    @Query('utm_campaign') utmCampaign: string | undefined,
    @Query('utm_term') utmTerm: string | undefined,
    @Query('utm_content') utmContent: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const host = req.headers.host ?? '';
    const domain = host.split(':')[0] || undefined;
    const ip = this.getClientIp(req);
    const userAgent = req.headers['user-agent'] ?? '';
    const referrerHeader = req.headers['referer'] ?? req.headers['referrer'];
    const referrer = typeof referrerHeader === 'string' ? referrerHeader : '';
    const country = (req.headers['x-country'] as string) ?? undefined;
    const deviceType = (req.headers['x-device-type'] as string) ?? undefined;
    const requestId = (req.headers['x-request-id'] as string) ?? undefined;

    const targetUrl = await this.service.resolveAndTrack(code, {
      domain,
      ip,
      userAgent,
      referrer,
      country,
      deviceType,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      requestId,
    });

    return res.redirect(302, targetUrl);
  }

  private getClientIp(req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0]?.trim();
    }
    return req.socket.remoteAddress ?? '';
  }
}
