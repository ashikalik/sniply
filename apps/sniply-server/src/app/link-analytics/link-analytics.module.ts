import { Module } from '@nestjs/common';
import { LinkAnalyticsV1Module } from './v1/link-analytics-v1.module';

@Module({
  imports: [LinkAnalyticsV1Module],
})
export class LinkAnalyticsModule {}
