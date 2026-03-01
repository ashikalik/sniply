import { Controller, Get, Query, Req } from '@nestjs/common';
import { IAuthRequest } from '@sniply/authentication';
import { ListQrCodesV1Service } from './list-qr-codes-v1.service';

@Controller('qr-codes/list')
export class ListQrCodesV1Controller {
  constructor(private readonly service: ListQrCodesV1Service) {}

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
