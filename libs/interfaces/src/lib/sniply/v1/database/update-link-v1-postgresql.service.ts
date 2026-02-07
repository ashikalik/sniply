import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ISniplyLinkV1Update } from '../service/sniply-link-v1-update.interface';
import { SniplyLinkV1Entity } from './sniply-link-v1.entity';
import { ISniplyLinkV1 } from './sniply-link-v1-db.interface';

@Injectable()
export class UpdateLinkV1PostgresqlService implements ISniplyLinkV1Update {
  constructor(
    @InjectRepository(SniplyLinkV1Entity)
    private readonly repo: Repository<SniplyLinkV1Entity>,
  ) {}

  async updateByCode(
    code: string,
    patch: Partial<ISniplyLinkV1>,
  ): Promise<ISniplyLinkV1 | null> {
    const record = await this.repo.findOne({
      where: {
        code,
        deleted_at: IsNull(),
      },
    });
    if (!record) {
      return null;
    }

    Object.assign(record, patch, { updated_at: new Date() });
    return this.repo.save(record);
  }
}
