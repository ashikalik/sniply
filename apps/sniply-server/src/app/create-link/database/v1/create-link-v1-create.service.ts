import { Injectable } from '@nestjs/common';
import { ISniplyLinkV1Create, ISniplyLinkV1 } from '@sniply/interfaces';

@Injectable()
export class CreateLinkV1CreateService implements ISniplyLinkV1Create {
  async create(link: ISniplyLinkV1): Promise<ISniplyLinkV1> {
    return link;
  }
}
