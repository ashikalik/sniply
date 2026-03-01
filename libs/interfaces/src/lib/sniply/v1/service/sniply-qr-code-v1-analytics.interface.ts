import { ISniplyQrScanV1 } from '../database/sniply-qr-scan-v1-db.interface';

export interface ISniplyQrCodeV1Analytics {
  getByCode(
    code: string,
    userId: string,
    from?: Date,
    to?: Date,
  ): Promise<{
    code: string;
    from: string | null;
    to: string | null;
    total: number;
    scans: ISniplyQrScanV1[];
  }>;
}
