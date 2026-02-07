import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ISniplyLinkV1Read } from '../service/sniply-link-v1-read.interface';
import { SniplyLinkV1Entity } from './sniply-link-v1.entity';

@Injectable()
export class ReadLinkV1PostgresqlService implements ISniplyLinkV1Read {
  constructor(
    @InjectRepository(SniplyLinkV1Entity)
    private readonly repo: Repository<SniplyLinkV1Entity>,
  ) {}

  async findByCode(code: string) {
    return this.repo.findOne({
      where: {
        code,
        deleted_at: IsNull(),
      },
    });
  }
}
