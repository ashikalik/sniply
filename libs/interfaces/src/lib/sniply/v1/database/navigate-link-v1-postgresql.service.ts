import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ISniplyLinkV1Navigate } from '../service/sniply-link-v1-navigate.interface';
import { SniplyLinkV1Entity } from './sniply-link-v1.entity';

@Injectable()
export class NavigateLinkV1PostgresqlService implements ISniplyLinkV1Navigate {
  constructor(
    @InjectRepository(SniplyLinkV1Entity)
    private readonly repo: Repository<SniplyLinkV1Entity>,
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

  async incrementClick(id: string): Promise<void> {
    await this.repo.increment({ id }, 'click_count', 1);
  }
}
