import { ISniplyLinkClickV1 } from '../database/sniply-link-click-v1-db.interface';

export interface ISniplyLinkV1ClickCreate {
  create(click: ISniplyLinkClickV1): Promise<void>;
}
