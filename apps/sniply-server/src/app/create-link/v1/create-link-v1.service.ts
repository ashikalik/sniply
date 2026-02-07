import { Inject, Injectable } from '@nestjs/common';
import { ISniplyLinkV1Create } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_CREATE } from './create-link-v1.tokens';

@Injectable()
export class CreateLinkV1Service {
  constructor(
    @Inject(SNIPLY_LINK_V1_CREATE)
    private readonly creator: ISniplyLinkV1Create,
  ) {}
}
