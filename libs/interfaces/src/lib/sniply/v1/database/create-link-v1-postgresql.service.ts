import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SniplyLinkV1Entity } from './sniply-link-v1.entity';
import { ISniplyLinkV1 } from './sniply-link-v1-db.interface';

@Injectable()
export class CreateLinkV1PostgresqlService  {
  constructor(
    @InjectRepository(SniplyLinkV1Entity)
    private readonly repo: Repository<SniplyLinkV1Entity>,
  ) {}

  async create(link: ISniplyLinkV1): Promise<ISniplyLinkV1> {
    const entity = this.repo.create(link);
    return this.repo.save(entity);
  }
}
