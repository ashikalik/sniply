import { Module } from '@nestjs/common';
import { QrCodeAnalyticsV1Module } from './v1/qr-code-analytics-v1.module';

@Module({
  imports: [QrCodeAnalyticsV1Module],
})
export class QrCodeAnalyticsModule {}
