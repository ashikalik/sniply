import { Injectable } from '@nestjs/common';
import { SniplyQrCodeV1Entity } from '@sniply/interfaces';
import { toQrCodeResponse } from '@sniply/qr-code';

@Injectable()
export class ListQrCodesV1Helper {
  toResponse(record: SniplyQrCodeV1Entity) {
    return toQrCodeResponse(record).then((response) => ({
      ...response,
      scans: record.scan_count,
    }));
  }
}
