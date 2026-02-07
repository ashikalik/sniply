import { Body, Controller, Post } from '@nestjs/common';
import { ISniplyLinkV1CreateRequest } from '@sniply/interfaces';
import { CreateLinkV1Service } from './create-link-v1.service';

@Controller('links')
export class CreateLinkV1Controller {
  constructor(private readonly service: CreateLinkV1Service) {}

  @Post()
  create(@Body() body: ISniplyLinkV1CreateRequest) {
    return this.service.create(body);
  }
}
