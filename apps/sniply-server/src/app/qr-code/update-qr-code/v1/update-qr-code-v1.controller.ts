import { Body, Controller, Param, Patch, Req } from '@nestjs/common';
import { ISniplyQrCodeV1UpdateRequest } from '@sniply/interfaces';
import { IAuthRequest } from '@sniply/authentication';
import { UpdateQrCodeV1Service } from './update-qr-code-v1.service';

@Controller('qr-codes')
export class UpdateQrCodeV1Controller {
  constructor(private readonly service: UpdateQrCodeV1Service) {}

  @Patch('update/:code')
  update(
    @Param('code') code: string,
    @Body() body: ISniplyQrCodeV1UpdateRequest,
    @Req() req: IAuthRequest,
  ) {
    return this.service.update(code, body, req.authUser?.sub);
  }
}
