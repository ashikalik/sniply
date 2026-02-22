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

  async findByCode(code: string, userId: string) {
    return this.repo.findOne({
      where: {
        code,
        created_by_user_id: userId,
        deleted_at: IsNull(),
      },
    });
  }

  async list(page: number, limit: number, userId: string) {
    const [items, total] = await this.repo.findAndCount({
      where: {
        created_by_user_id: userId,
        deleted_at: IsNull(),
      },
      order: {
        created_at: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { items, total };
  }
}
