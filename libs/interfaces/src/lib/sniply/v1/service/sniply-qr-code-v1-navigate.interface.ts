import { ISniplyQrCodeV1 } from '../database/sniply-qr-code-v1-db.interface';

export interface ISniplyQrCodeV1Navigate {
  findByCode(code: string, domain?: string): Promise<ISniplyQrCodeV1 | null>;
  incrementScan(id: string): Promise<void>;
}
