import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreateQrCodeV1PostgresqlService,
  SniplyQrCodeV1Entity,
} from '@sniply/interfaces';
import { CreateQrCodeV1Controller } from './create-qr-code-v1.controller';
import { CreateQrCodeV1Service } from './create-qr-code-v1.service';
import { SNIPLY_QR_CODE_V1_CREATE } from './create-qr-code-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyQrCodeV1Entity])],
  controllers: [CreateQrCodeV1Controller],
  providers: [
    CreateQrCodeV1Service,
    {
      provide: SNIPLY_QR_CODE_V1_CREATE,
      useClass: CreateQrCodeV1PostgresqlService,
    },
  ],
})
export class CreateQrCodeV1Module {}
