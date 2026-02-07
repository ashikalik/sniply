import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISniplyLinkClickV1 } from './sniply-link-click-v1-db.interface';
import { ISniplyLinkV1ClickCreate } from '../service/sniply-link-v1-click-create.interface';
import { SniplyLinkClickV1Entity } from './sniply-link-click-v1.entity';

@Injectable()
export class CreateLinkClickV1PostgresqlService
  implements ISniplyLinkV1ClickCreate
{
  constructor(
    @InjectRepository(SniplyLinkClickV1Entity)
    private readonly repo: Repository<SniplyLinkClickV1Entity>,
  ) {}

  async create(click: ISniplyLinkClickV1): Promise<void> {
    const entity = this.repo.create(click);
    await this.repo.save(entity);
  }
}
