import { BadRequestException, Injectable } from '@nestjs/common';
import { ISniplyQrCodeV1 } from '@sniply/interfaces';

@Injectable()
export class NavigateQrCodeV1Helper {
  validate(record: ISniplyQrCodeV1) {
    if (!record.is_active) {
      throw new BadRequestException('QR code is inactive');
    }

    if (record.expires_at && record.expires_at.getTime() <= Date.now()) {
      throw new BadRequestException('QR code has expired');
    }
  }
}
