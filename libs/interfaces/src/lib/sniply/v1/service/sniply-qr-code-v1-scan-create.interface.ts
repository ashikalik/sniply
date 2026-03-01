import { ISniplyQrScanV1 } from '../database/sniply-qr-scan-v1-db.interface';

export interface ISniplyQrCodeV1ScanCreate {
  create(scan: ISniplyQrScanV1): Promise<void>;
}
