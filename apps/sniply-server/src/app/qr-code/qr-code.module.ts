import { Module } from '@nestjs/common';
import { CreateQrCodeModule } from './create-qr-code/create-qr-code.module';
import { ReadQrCodeModule } from './read-qr-code/read-qr-code.module';
import { NavigateQrCodeModule } from './navigate-qr-code/navigate-qr-code.module';
import { UpdateQrCodeModule } from './update-qr-code/update-qr-code.module';
import { DeleteQrCodeModule } from './delete-qr-code/delete-qr-code.module';
import { QrCodeAnalyticsModule } from './qr-code-analytics/qr-code-analytics.module';
import { ListQrCodesModule } from './list-qr-codes/list-qr-codes.module';

@Module({
  imports: [
    CreateQrCodeModule,
    ReadQrCodeModule,
    NavigateQrCodeModule,
    UpdateQrCodeModule,
    DeleteQrCodeModule,
    QrCodeAnalyticsModule,
    ListQrCodesModule,
  ],
})
export class QrCodeModule {}
