import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteQrCodeV1PostgresqlService, SniplyQrCodeV1Entity } from '@sniply/interfaces';
import { DeleteQrCodeV1Controller } from './delete-qr-code-v1.controller';
import { DeleteQrCodeV1Service } from './delete-qr-code-v1.service';
import { SNIPLY_QR_CODE_V1_DELETE } from './delete-qr-code-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyQrCodeV1Entity])],
  controllers: [DeleteQrCodeV1Controller],
  providers: [
    DeleteQrCodeV1Service,
    {
      provide: SNIPLY_QR_CODE_V1_DELETE,
      useClass: DeleteQrCodeV1PostgresqlService,
    },
  ],
})
export class DeleteQrCodeV1Module {}
