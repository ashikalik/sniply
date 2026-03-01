import { Module } from '@nestjs/common';
import { ReadQrCodeV1Module } from './v1/read-qr-code-v1.module';

@Module({
  imports: [ReadQrCodeV1Module],
})
export class ReadQrCodeModule {}
