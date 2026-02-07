import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Repository } from 'typeorm';
import { ISniplyLinkV1Analytics } from '../service/sniply-link-v1-analytics.interface';
import { SniplyLinkClickV1Entity } from './sniply-link-click-v1.entity';
import { SniplyLinkV1Entity } from './sniply-link-v1.entity';

@Injectable()
export class LinkAnalyticsV1PostgresqlService implements ISniplyLinkV1Analytics {
  constructor(
    @InjectRepository(SniplyLinkV1Entity)
    private readonly linkRepo: Repository<SniplyLinkV1Entity>,
    @InjectRepository(SniplyLinkClickV1Entity)
    private readonly clickRepo: Repository<SniplyLinkClickV1Entity>,
  ) {}

  async getByCode(code: string, from?: Date, to?: Date) {
    const link = await this.linkRepo.findOne({
      where: {
        code,
        deleted_at: IsNull(),
      },
    });

    if (!link) {
      return {
        code,
        from: from?.toISOString() ?? null,
        to: to?.toISOString() ?? null,
        total: 0,
        clicks: [],
      };
    }

    const where: Record<string, unknown> = {
      short_link_id: link.id,
    };

    if (from && to) {
      where.clicked_at = Between(from, to);
    } else if (from) {
      where.clicked_at = Between(from, new Date(8640000000000000));
    } else if (to) {
      where.clicked_at = Between(new Date(0), to);
    }

    const [clicks, total] = await this.clickRepo.findAndCount({
      where,
      order: { clicked_at: 'DESC' },
      take: 500,
    });

    return {
      code: link.code,
      from: from?.toISOString() ?? null,
      to: to?.toISOString() ?? null,
      total,
      clicks,
    };
  }
}
