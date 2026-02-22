import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ISniplyLinkV1Delete } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_DELETE } from './delete-link-v1.tokens';

@Injectable()
export class DeleteLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_DELETE)
    private readonly deleter: ISniplyLinkV1Delete,
  ) {}

  async remove(code: string, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    if (!code?.trim()) {
      throw new BadRequestException('code is required');
    }

    const deleted = await this.deleter.softDeleteByCode(code, userId);
    if (!deleted) {
      throw new BadRequestException('Link not found');
    }

    return { ok: true };
  }

  async removeMany(codesCsv: string, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    if (!codesCsv?.trim()) {
      throw new BadRequestException('codes query param is required');
    }

    const codes = Array.from(
      new Set(
        codesCsv
          .split(',')
          .map((code) => code.trim())
          .filter(Boolean),
      ),
    );

    if (codes.length === 0) {
      throw new BadRequestException('No valid codes provided');
    }

    const deletedCount = await this.deleter.softDeleteByCodes(codes, userId);

    return {
      ok: true,
      requested: codes.length,
      deleted: deletedCount,
    };
  }
}
