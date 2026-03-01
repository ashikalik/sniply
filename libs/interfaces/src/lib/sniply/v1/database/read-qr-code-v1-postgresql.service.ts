import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ISniplyQrCodeV1Read } from '../service/sniply-qr-code-v1-read.interface';
import { SniplyQrCodeV1Entity } from './sniply-qr-code-v1.entity';

@Injectable()
export class ReadQrCodeV1PostgresqlService implements ISniplyQrCodeV1Read {
  constructor(
    @InjectRepository(SniplyQrCodeV1Entity)
    private readonly repo: Repository<SniplyQrCodeV1Entity>,
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
