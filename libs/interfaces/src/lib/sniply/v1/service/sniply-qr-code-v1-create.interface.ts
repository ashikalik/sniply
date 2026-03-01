import { ISniplyQrCodeV1 } from '../database/sniply-qr-code-v1-db.interface';

export interface ISniplyQrCodeV1Create {
  create(qrCode: ISniplyQrCodeV1): Promise<ISniplyQrCodeV1>;
}
