import { ISniplyLinkV1 } from '../database/sniply-link-v1-db.interface';

export interface ISniplyLinkV1Navigate {
  findByCode(code: string, domain?: string): Promise<ISniplyLinkV1 | null>;
  incrementClick(id: string): Promise<void>;
}
