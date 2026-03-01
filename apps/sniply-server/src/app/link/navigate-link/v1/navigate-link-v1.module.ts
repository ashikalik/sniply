import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigateLinkV1Controller } from './navigate-link-v1.controller';
import { NavigateLinkV1Service } from './navigate-link-v1.service';
import { NavigateLinkV1Helper } from './navigate-link-v1.helper';
import {
  CreateLinkClickV1PostgresqlService,
  NavigateLinkV1PostgresqlService,
  SniplyLinkClickV1Entity,
  SniplyLinkV1Entity,
} from '@sniply/interfaces';
import {
  SNIPLY_LINK_V1_CLICK_CREATE,
  SNIPLY_LINK_V1_NAVIGATE,
} from './navigate-link-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyLinkV1Entity, SniplyLinkClickV1Entity])],
  controllers: [NavigateLinkV1Controller],
  providers: [
    NavigateLinkV1Service,
    NavigateLinkV1Helper,
    {
      provide: SNIPLY_LINK_V1_NAVIGATE,
      useClass: NavigateLinkV1PostgresqlService,
    },
    {
      provide: SNIPLY_LINK_V1_CLICK_CREATE,
      useClass: CreateLinkClickV1PostgresqlService,
    },
  ],
})
export class NavigateLinkV1Module {}
