import { Module } from '@nestjs/common';
import { NavigateQrCodeV1Module } from './v1/navigate-qr-code-v1.module';

@Module({
  imports: [NavigateQrCodeV1Module],
})
export class NavigateQrCodeModule {}
