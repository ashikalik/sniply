import { Controller, Delete, Param, Query, Req } from '@nestjs/common';
import { IAuthRequest } from '@sniply/authentication';
import { DeleteQrCodeV1Service } from './delete-qr-code-v1.service';

@Controller('qr-codes')
export class DeleteQrCodeV1Controller {
  constructor(private readonly service: DeleteQrCodeV1Service) {}

  @Delete('delete/:code')
  remove(
    @Param('code') code: string,
    @Req() req: IAuthRequest,
  ) {
    return this.service.remove(code, req.authUser?.sub);
  }

  @Delete('delete')
  removeMany(
    @Query('codes') codes: string,
    @Req() req: IAuthRequest,
  ) {
    return this.service.removeMany(codes, req.authUser?.sub);
  }
}
