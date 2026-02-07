import { Controller, Delete, Param } from '@nestjs/common';
import { DeleteLinkV1Service } from './delete-link-v1.service';

@Controller('links')
export class DeleteLinkV1Controller {
  constructor(private readonly service: DeleteLinkV1Service) {}

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.service.remove(code);
  }
}
