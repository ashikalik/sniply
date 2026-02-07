import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { NavigateLinkV1Service } from './navigate-link-v1.service';

@Controller('r')
export class NavigateLinkV1Controller {
  constructor(private readonly service: NavigateLinkV1Service) {}

  @Get(':code')
  async navigate(
    @Param('code') code: string,
    @Query('password') password: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const host = req.headers.host ?? '';
    const domain = host.split(':')[0] || undefined;
    const longUrl = await this.service.resolveAndTrack(code, domain, password);

    return res.redirect(302, longUrl);
  }
}
