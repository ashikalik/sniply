import { ISniplyQrCodeV1 } from '../database/sniply-qr-code-v1-db.interface';

export interface ISniplyQrCodeV1Update {
  updateByCode(
    code: string,
    patch: Partial<ISniplyQrCodeV1>,
    userId: string,
  ): Promise<ISniplyQrCodeV1 | null>;
}
