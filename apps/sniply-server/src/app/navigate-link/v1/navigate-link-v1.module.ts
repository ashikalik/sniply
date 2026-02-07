import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NavigateLinkV1Controller } from './navigate-link-v1.controller';
import { NavigateLinkV1Service } from './navigate-link-v1.service';
import { NavigateLinkV1PostgresqlService, SniplyLinkV1Entity } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_NAVIGATE } from './navigate-link-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyLinkV1Entity])],
  controllers: [NavigateLinkV1Controller],
  providers: [
    NavigateLinkV1Service,
    {
      provide: SNIPLY_LINK_V1_NAVIGATE,
      useClass: NavigateLinkV1PostgresqlService,
    },
  ],
})
export class NavigateLinkV1Module {}
