import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkAnalyticsV1Controller } from './link-analytics-v1.controller';
import { LinkAnalyticsV1Service } from './link-analytics-v1.service';
import {
  LinkAnalyticsV1PostgresqlService,
  SniplyLinkClickV1Entity,
  SniplyLinkV1Entity,
} from '@sniply/interfaces';
import { SNIPLY_LINK_V1_ANALYTICS } from './link-analytics-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyLinkV1Entity, SniplyLinkClickV1Entity])],
  controllers: [LinkAnalyticsV1Controller],
  providers: [
    LinkAnalyticsV1Service,
    {
      provide: SNIPLY_LINK_V1_ANALYTICS,
      useClass: LinkAnalyticsV1PostgresqlService,
    },
  ],
})
export class LinkAnalyticsV1Module {}
