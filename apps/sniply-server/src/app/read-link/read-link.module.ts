import { Module } from '@nestjs/common';
import { ReadLinkV1Module } from './v1/read-link-v1.module';

@Module({
  imports: [ReadLinkV1Module],
})
export class ReadLinkModule {}
