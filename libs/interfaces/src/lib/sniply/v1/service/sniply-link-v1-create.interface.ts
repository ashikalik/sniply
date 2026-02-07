import { ISniplyLinkV1 } from '../database/sniply-link-v1-db.interface';

export interface ISniplyLinkV1Create {
  create(link: ISniplyLinkV1): Promise<ISniplyLinkV1>;
}
