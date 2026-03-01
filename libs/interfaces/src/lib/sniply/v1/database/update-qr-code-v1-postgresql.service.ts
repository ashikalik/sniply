import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ISniplyQrCodeV1Update } from '../service/sniply-qr-code-v1-update.interface';
import { SniplyQrCodeV1Entity } from './sniply-qr-code-v1.entity';
import { ISniplyQrCodeV1 } from './sniply-qr-code-v1-db.interface';

@Injectable()
export class UpdateQrCodeV1PostgresqlService implements ISniplyQrCodeV1Update {
  constructor(
    @InjectRepository(SniplyQrCodeV1Entity)
    private readonly repo: Repository<SniplyQrCodeV1Entity>,
  ) {}

  async updateByCode(
    code: string,
    patch: Partial<ISniplyQrCodeV1>,
    userId: string,
  ): Promise<ISniplyQrCodeV1 | null> {
    const record = await this.repo.findOne({
      where: {
        code,
        created_by_user_id: userId,
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
