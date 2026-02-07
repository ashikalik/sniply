import { ISniplyLinkV1 } from '../database/sniply-link-v1-db.interface';

export interface ISniplyLinkV1Update {
  updateByCode(
    code: string,
    patch: Partial<ISniplyLinkV1>,
  ): Promise<ISniplyLinkV1 | null>;
}
