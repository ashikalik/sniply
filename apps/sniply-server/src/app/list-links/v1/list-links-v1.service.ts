import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SniplyLinkV1Entity } from '@sniply/interfaces';
import { IsNull, Repository } from 'typeorm';
import { ListLinksV1Helper } from './list-links-v1.helper';

@Injectable()
export class ListLinksV1Service {
  constructor(
    @InjectRepository(SniplyLinkV1Entity)
    private readonly repo: Repository<SniplyLinkV1Entity>,
    private readonly helper: ListLinksV1Helper,
  ) {}

  async list(start?: number, page?: number, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    const safeStart = Number.isFinite(start) && (start as number) >= 0
      ? Number(start)
      : 0;
    const safePage = Number.isFinite(page) && (page as number) > 0
      ? Math.min(Number(page), 100)
      : 10;

    const [items, total] = await this.repo.findAndCount({
      where: {
        created_by_user_id: userId,
        deleted_at: IsNull(),
      },
      order: {
        created_at: 'DESC',
      },
      skip: safeStart,
      take: safePage,
    });

    return {
      items: items.map((item) => this.helper.toResponse(item)),
      pagination: {
        start: safeStart,
        page: safePage,
        total,
      },
    };
  }
}
