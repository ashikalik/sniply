import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ISniplyLinkV1Read } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_READ } from './read-link-v1.tokens';
import { ReadLinkV1Helper } from './read-link-v1.helper';

@Injectable()
export class ReadLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_READ)
    private readonly reader: ISniplyLinkV1Read,
    private readonly helper: ReadLinkV1Helper,
  ) {}

  async findByCode(code: string, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    const record = await this.reader.findByCode(code, userId);
    if (!record) {
      throw new BadRequestException('Link not found');
    }

    return this.helper.toResponse(record);
  }

  async list(page?: number, limit?: number, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0
      ? Math.min(limit, 100)
      : 20;

    const { items, total } = await this.reader.list(safePage, safeLimit, userId);

    return {
      items: items.map((item) => this.helper.toResponse(item)),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }
}
