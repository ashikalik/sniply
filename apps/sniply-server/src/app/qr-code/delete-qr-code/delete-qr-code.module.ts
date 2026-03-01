import { Module } from '@nestjs/common';
import { DeleteQrCodeV1Module } from './v1/delete-qr-code-v1.module';

@Module({
  imports: [DeleteQrCodeV1Module],
})
export class DeleteQrCodeModule {}
