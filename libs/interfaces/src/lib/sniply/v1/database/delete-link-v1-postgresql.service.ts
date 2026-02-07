import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ISniplyLinkV1Delete } from '../service/sniply-link-v1-delete.interface';
import { SniplyLinkV1Entity } from './sniply-link-v1.entity';

@Injectable()
export class DeleteLinkV1PostgresqlService implements ISniplyLinkV1Delete {
  constructor(
    @InjectRepository(SniplyLinkV1Entity)
    private readonly repo: Repository<SniplyLinkV1Entity>,
  ) {}

  async softDeleteByCode(code: string): Promise<boolean> {
    const record = await this.repo.findOne({
      where: {
        code,
        deleted_at: IsNull(),
      },
    });
    if (!record) {
      return false;
    }

    record.deleted_at = new Date();
    record.is_active = false;
    await this.repo.save(record);
    return true;
  }
}
