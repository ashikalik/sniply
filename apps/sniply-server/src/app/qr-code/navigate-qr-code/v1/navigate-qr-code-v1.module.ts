import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreateQrScanV1PostgresqlService,
  NavigateQrCodeV1PostgresqlService,
  SniplyQrCodeV1Entity,
  SniplyQrScanV1Entity,
} from '@sniply/interfaces';
import { NavigateQrCodeV1Controller } from './navigate-qr-code-v1.controller';
import { NavigateQrCodeV1Helper } from './navigate-qr-code-v1.helper';
import { NavigateQrCodeV1Service } from './navigate-qr-code-v1.service';
import {
  SNIPLY_QR_CODE_V1_NAVIGATE,
  SNIPLY_QR_CODE_V1_SCAN_CREATE,
} from './navigate-qr-code-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyQrCodeV1Entity, SniplyQrScanV1Entity])],
  controllers: [NavigateQrCodeV1Controller],
  providers: [
    NavigateQrCodeV1Service,
    NavigateQrCodeV1Helper,
    {
      provide: SNIPLY_QR_CODE_V1_NAVIGATE,
      useClass: NavigateQrCodeV1PostgresqlService,
    },
    {
      provide: SNIPLY_QR_CODE_V1_SCAN_CREATE,
      useClass: CreateQrScanV1PostgresqlService,
    },
  ],
})
export class NavigateQrCodeV1Module {}
