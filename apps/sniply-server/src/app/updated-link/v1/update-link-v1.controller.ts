import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ISniplyLinkV1UpdateRequest } from '@sniply/interfaces';
import { UpdateLinkV1Service } from './update-link-v1.service';

@Controller('links')
export class UpdateLinkV1Controller {
  constructor(private readonly service: UpdateLinkV1Service) {}

  @Patch(':code')
  update(
    @Param('code') code: string,
    @Body() body: ISniplyLinkV1UpdateRequest,
  ) {
    return this.service.update(code, body);
  }
}
