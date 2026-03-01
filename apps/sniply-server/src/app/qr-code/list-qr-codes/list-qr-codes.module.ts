import { Module } from '@nestjs/common';
import { ListQrCodesV1Module } from './v1/list-qr-codes-v1.module';

@Module({
  imports: [ListQrCodesV1Module],
})
export class ListQrCodesModule {}
