import { Injectable } from '@nestjs/common';
import {
  CreateLinkV1PostgresqlService,
  ISniplyLinkV1,
  ISniplyLinkV1Create,
} from '@sniply/interfaces';

@Injectable()
export class CreateLinkV1HelperService implements ISniplyLinkV1Create {
  constructor(
    private readonly postgresql: CreateLinkV1PostgresqlService,
  ) {}

  async create(link: ISniplyLinkV1): Promise<ISniplyLinkV1> {
    return this.postgresql.create(link);
  }
}
