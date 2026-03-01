import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadQrCodeV1PostgresqlService, SniplyQrCodeV1Entity } from '@sniply/interfaces';
import { ReadQrCodeV1Controller } from './read-qr-code-v1.controller';
import { ReadQrCodeV1Helper } from './read-qr-code-v1.helper';
import { ReadQrCodeV1Service } from './read-qr-code-v1.service';
import { SNIPLY_QR_CODE_V1_READ } from './read-qr-code-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyQrCodeV1Entity])],
  controllers: [ReadQrCodeV1Controller],
  providers: [
    ReadQrCodeV1Service,
    ReadQrCodeV1Helper,
    {
      provide: SNIPLY_QR_CODE_V1_READ,
      useClass: ReadQrCodeV1PostgresqlService,
    },
  ],
})
export class ReadQrCodeV1Module {}
