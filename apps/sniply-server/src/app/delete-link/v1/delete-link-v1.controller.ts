import { Controller, Delete, Param, Query, Req } from '@nestjs/common';
import { IAuthRequest } from '@sniply/authentication';
import { DeleteLinkV1Service } from './delete-link-v1.service';

@Controller('links')
export class DeleteLinkV1Controller {
  constructor(private readonly service: DeleteLinkV1Service) {}

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
