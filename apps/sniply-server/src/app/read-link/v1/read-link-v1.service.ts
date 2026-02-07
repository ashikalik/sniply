import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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

  async findByCode(code: string) {
    const record = await this.reader.findByCode(code);
    if (!record) {
      throw new BadRequestException('Link not found');
    }

    return this.helper.toResponse(record);
  }
}
