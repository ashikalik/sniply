import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { IAuthRequest } from '@sniply/authentication';
import { ReadLinkV1Service } from './read-link-v1.service';

@Controller('links')
export class ReadLinkV1Controller {
  constructor(private readonly service: ReadLinkV1Service) {}

  @Get('read/:code')
  findByCode(
    @Param('code') code: string,
    @Req() req: IAuthRequest,
  ) {
    return this.service.findByCode(code, req.authUser?.sub);
  }

  @Get('list')
  list(
    @Req() req: IAuthRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedPage = page ? Number(page) : undefined;
    const parsedLimit = limit ? Number(limit) : undefined;
    return this.service.list(parsedPage, parsedLimit, req.authUser?.sub);
  }
}
