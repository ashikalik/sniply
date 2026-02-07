import { ISniplyLinkV1 } from '../database/sniply-link-v1-db.interface';

export interface ISniplyLinkV1Read {
  findByCode(code: string): Promise<ISniplyLinkV1 | null>;
}
