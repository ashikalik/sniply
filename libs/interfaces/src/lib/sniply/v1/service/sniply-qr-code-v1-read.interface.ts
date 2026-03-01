import { ISniplyQrCodeV1 } from '../database/sniply-qr-code-v1-db.interface';

export interface ISniplyQrCodeV1Read {
  findByCode(code: string, userId: string): Promise<ISniplyQrCodeV1 | null>;
  list(page: number, limit: number, userId: string): Promise<{
    items: ISniplyQrCodeV1[];
    total: number;
  }>;
}
