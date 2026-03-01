import { Controller, Get, Param, Req } from '@nestjs/common';
import { IAuthRequest } from '@sniply/authentication';
import { ReadQrCodeV1Service } from './read-qr-code-v1.service';

@Controller('qr-codes')
export class ReadQrCodeV1Controller {
  constructor(private readonly service: ReadQrCodeV1Service) {}

  @Get('read/:code')
  findByCode(
    @Param('code') code: string,
    @Req() req: IAuthRequest,
  ) {
    return this.service.findByCode(code, req.authUser?.sub);
  }
}
