import { Module } from '@nestjs/common';
import { CreateQrCodeV1Module } from './v1/create-qr-code-v1.module';

@Module({
  imports: [CreateQrCodeV1Module],
})
export class CreateQrCodeModule {}
