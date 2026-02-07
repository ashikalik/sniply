import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ISniplyLinkV1Delete } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_DELETE } from './delete-link-v1.tokens';

@Injectable()
export class DeleteLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_DELETE)
    private readonly deleter: ISniplyLinkV1Delete,
  ) {}

  async remove(code: string) {
    if (!code?.trim()) {
      throw new BadRequestException('code is required');
    }

    const deleted = await this.deleter.softDeleteByCode(code);
    if (!deleted) {
      throw new BadRequestException('Link not found');
    }

    return { ok: true };
  }
}
