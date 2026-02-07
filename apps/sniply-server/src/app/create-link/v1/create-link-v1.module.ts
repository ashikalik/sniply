import { Module } from '@nestjs/common';
import { CreateLinkV1Controller } from './create-link-v1.controller';
import { CreateLinkV1Service } from './create-link-v1.service';
import { CreateLinkV1CreateService } from '../database/v1/create-link-v1-create.service';
import { SNIPLY_LINK_V1_CREATE } from './create-link-v1.tokens';

@Module({
  controllers: [CreateLinkV1Controller],
  providers: [
    CreateLinkV1Service,
    {
      provide: SNIPLY_LINK_V1_CREATE,
      useClass: CreateLinkV1CreateService,
    },
  ],
})
export class CreateLinkV1Module {}
