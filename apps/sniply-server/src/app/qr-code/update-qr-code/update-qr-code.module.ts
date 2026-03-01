import { Module } from '@nestjs/common';
import { UpdateQrCodeV1Module } from './v1/update-qr-code-v1.module';

@Module({
  imports: [UpdateQrCodeV1Module],
})
export class UpdateQrCodeModule {}
