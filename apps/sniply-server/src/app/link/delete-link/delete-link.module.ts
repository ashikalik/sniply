import { Module } from '@nestjs/common';
import { DeleteLinkV1Module } from './v1/delete-link-v1.module';

@Module({
  imports: [DeleteLinkV1Module],
})
export class DeleteLinkModule {}
