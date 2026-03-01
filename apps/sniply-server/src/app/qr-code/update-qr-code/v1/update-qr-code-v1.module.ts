import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SniplyQrCodeV1Entity, UpdateQrCodeV1PostgresqlService } from '@sniply/interfaces';
import { UpdateQrCodeV1Controller } from './update-qr-code-v1.controller';
import { UpdateQrCodeV1Service } from './update-qr-code-v1.service';
import { SNIPLY_QR_CODE_V1_UPDATE } from './update-qr-code-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyQrCodeV1Entity])],
  controllers: [UpdateQrCodeV1Controller],
  providers: [
    UpdateQrCodeV1Service,
    {
      provide: SNIPLY_QR_CODE_V1_UPDATE,
      useClass: UpdateQrCodeV1PostgresqlService,
    },
  ],
})
export class UpdateQrCodeV1Module {}
