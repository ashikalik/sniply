import { ISniplyLinkClickV1 } from '../database/sniply-link-click-v1-db.interface';

export interface ISniplyLinkV1Analytics {
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
    clicks: ISniplyLinkClickV1[];
  }>;
}
