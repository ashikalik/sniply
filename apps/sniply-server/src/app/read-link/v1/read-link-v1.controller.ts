import { Controller, Get, Param } from '@nestjs/common';
import { ReadLinkV1Service } from './read-link-v1.service';

@Controller('links')
export class ReadLinkV1Controller {
  constructor(private readonly service: ReadLinkV1Service) {}

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.service.findByCode(code);
  }
}
