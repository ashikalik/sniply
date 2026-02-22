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

  async softDeleteByCode(code: string, userId: string): Promise<boolean> {
    const record = await this.repo.findOne({
      where: {
        code,
        created_by_user_id: userId,
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

  async softDeleteByCodes(codes: string[], userId: string): Promise<number> {
    if (codes.length === 0) {
      return 0;
    }

    const result = await this.repo
      .createQueryBuilder()
      .update(SniplyLinkV1Entity)
      .set({
        deleted_at: new Date(),
        is_active: false,
      })
      .where('code IN (:...codes)', { codes })
      .andWhere('created_by_user_id = :userId', { userId })
      .andWhere('deleted_at IS NULL')
      .execute();

    return result.affected ?? 0;
  }
}
