import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ISniplyQrCodeV1Navigate } from '../service/sniply-qr-code-v1-navigate.interface';
import { SniplyQrCodeV1Entity } from './sniply-qr-code-v1.entity';

@Injectable()
export class NavigateQrCodeV1PostgresqlService implements ISniplyQrCodeV1Navigate {
  constructor(
    @InjectRepository(SniplyQrCodeV1Entity)
    private readonly repo: Repository<SniplyQrCodeV1Entity>,
  ) {}

  async findByCode(code: string, domain?: string) {
    if (domain) {
      const byDomain = await this.repo.findOne({
        where: {
          code,
          domain,
          deleted_at: IsNull(),
        },
      });
      if (byDomain) {
        return byDomain;
      }
    }

    return this.repo.findOne({
      where: {
        code,
        domain: IsNull(),
        deleted_at: IsNull(),
      },
    });
  }

  async incrementScan(id: string): Promise<void> {
    await this.repo.increment({ id }, 'scan_count', 1);
  }
}
