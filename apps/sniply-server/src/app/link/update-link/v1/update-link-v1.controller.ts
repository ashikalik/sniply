import { Body, Controller, Param, Patch, Req } from '@nestjs/common';
import { ISniplyLinkV1UpdateRequest } from '@sniply/interfaces';
import { IAuthRequest } from '@sniply/authentication';
import { UpdateLinkV1Service } from './update-link-v1.service';

@Controller('links')
export class UpdateLinkV1Controller {
  constructor(private readonly service: UpdateLinkV1Service) {}

  @Patch('update/:code')
  update(
    @Param('code') code: string,
    @Body() body: ISniplyLinkV1UpdateRequest,
    @Req() req: IAuthRequest,
  ) {
    return this.service.update(code, body, req.authUser?.sub);
  }
}
