import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ISniplyQrCodeV1Read } from '@sniply/interfaces';
import { ReadQrCodeV1Helper } from './read-qr-code-v1.helper';
import { SNIPLY_QR_CODE_V1_READ } from './read-qr-code-v1.tokens';

@Injectable()
export class ReadQrCodeV1Service {
  constructor(
    @Inject(SNIPLY_QR_CODE_V1_READ)
    private readonly reader: ISniplyQrCodeV1Read,
    private readonly helper: ReadQrCodeV1Helper,
  ) {}

  async findByCode(code: string, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    const record = await this.reader.findByCode(code, userId);
    if (!record) {
      throw new BadRequestException('QR code not found');
    }

    return this.helper.toResponse(record);
  }

  async list(page?: number, limit?: number, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20;
    const { items, total } = await this.reader.list(safePage, safeLimit, userId);

    return {
      items: await Promise.all(items.map((item) => this.helper.toResponse(item))),
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }
}
