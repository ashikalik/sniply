import { Module } from '@nestjs/common';
import { UpdateLinkV1Module } from './v1/update-link-v1.module';

@Module({
  imports: [UpdateLinkV1Module],
})
export class UpdatedLinkModule {}
