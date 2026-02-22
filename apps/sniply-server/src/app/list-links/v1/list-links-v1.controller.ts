import { Controller, Get, Query, Req } from '@nestjs/common';
import { IAuthRequest } from '@sniply/authentication';
import { ListLinksV1Service } from './list-links-v1.service';

@Controller('list-links')
export class ListLinksV1Controller {
  constructor(private readonly service: ListLinksV1Service) {}

  @Get()
  list(
    @Req() req: IAuthRequest,
    @Query('start') start?: string,
    @Query('page') page?: string,
  ) {
    const parsedStart = start ? Number(start) : undefined;
    const parsedPage = page ? Number(page) : undefined;
    return this.service.list(parsedStart, parsedPage, req.authUser?.sub);
  }
}
