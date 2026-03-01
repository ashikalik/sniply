import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  QrCodeAnalyticsV1PostgresqlService,
  SniplyQrCodeV1Entity,
  SniplyQrScanV1Entity,
} from '@sniply/interfaces';
import { QrCodeAnalyticsV1Controller } from './qr-code-analytics-v1.controller';
import { QrCodeAnalyticsV1Service } from './qr-code-analytics-v1.service';
import { SNIPLY_QR_CODE_V1_ANALYTICS } from './qr-code-analytics-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyQrCodeV1Entity, SniplyQrScanV1Entity])],
  controllers: [QrCodeAnalyticsV1Controller],
  providers: [
    QrCodeAnalyticsV1Service,
    {
      provide: SNIPLY_QR_CODE_V1_ANALYTICS,
      useClass: QrCodeAnalyticsV1PostgresqlService,
    },
  ],
})
export class QrCodeAnalyticsV1Module {}
