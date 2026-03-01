import { Body, Controller, Post, Req } from '@nestjs/common';
import { ISniplyQrCodeV1CreateRequest } from '@sniply/interfaces';
import { IAuthRequest } from '@sniply/authentication';
import { CreateQrCodeV1Service } from './create-qr-code-v1.service';

@Controller('qr-codes')
export class CreateQrCodeV1Controller {
  constructor(private readonly service: CreateQrCodeV1Service) {}

  @Post('create')
  create(
    @Body() body: ISniplyQrCodeV1CreateRequest,
    @Req() req: IAuthRequest,
  ) {
    return this.service.create(body, req.authUser?.sub);
  }
}
