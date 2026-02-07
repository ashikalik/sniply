import { BadRequestException, Injectable } from '@nestjs/common';
import { ISniplyLinkV1 } from '@sniply/interfaces';

@Injectable()
export class NavigateLinkV1Helper {
  validate(record: ISniplyLinkV1, password?: string) {
    if (!record.is_active) {
      throw new BadRequestException('Link is inactive');
    }

    if (record.expires_at && record.expires_at.getTime() <= Date.now()) {
      throw new BadRequestException('Link has expired');
    }

    if (record.max_clicks !== null && record.max_clicks !== undefined) {
      if (record.click_count >= record.max_clicks) {
        throw new BadRequestException('Link has reached max clicks');
      }
    }

    if (record.password_hash) {
      if (!password || password !== record.password_hash) {
        throw new BadRequestException('Invalid password');
      }
    }
  }
}
