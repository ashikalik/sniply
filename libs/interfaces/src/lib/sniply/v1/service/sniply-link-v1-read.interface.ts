import { ISniplyLinkV1 } from '../database/sniply-link-v1-db.interface';

export interface ISniplyLinkV1Read {
  findByCode(code: string, userId: string): Promise<ISniplyLinkV1 | null>;
  list(page: number, limit: number, userId: string): Promise<{
    items: ISniplyLinkV1[];
    total: number;
  }>;
}
