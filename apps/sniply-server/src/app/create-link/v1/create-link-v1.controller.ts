import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ISniplyLinkV1CreateRequest,
} from '@sniply/interfaces';
import { CreateLinkV1Service } from './create-link-v1.service';
import { IAuthRequest } from '@sniply/authentication';

@Controller('links')
export class CreateLinkV1Controller {
  constructor(private readonly service: CreateLinkV1Service) {}

  @Post()
  create(
    @Body() body: ISniplyLinkV1CreateRequest,
    @Req() req: IAuthRequest,
  ) {
    return this.service.create(body, req.authUser?.sub);
  }
}
