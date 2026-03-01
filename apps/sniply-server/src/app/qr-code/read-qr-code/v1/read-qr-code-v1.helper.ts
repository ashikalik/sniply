import { Injectable } from '@nestjs/common';
import { ISniplyQrCodeV1 } from '@sniply/interfaces';
import { toQrCodeResponse } from '@sniply/qr-code';

@Injectable()
export class ReadQrCodeV1Helper {
  toResponse(record: ISniplyQrCodeV1) {
    return toQrCodeResponse(record);
  }
}
