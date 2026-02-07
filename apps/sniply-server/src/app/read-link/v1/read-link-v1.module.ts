import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadLinkV1Controller } from './read-link-v1.controller';
import { ReadLinkV1Service } from './read-link-v1.service';
import { ReadLinkV1PostgresqlService, SniplyLinkV1Entity } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_READ } from './read-link-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyLinkV1Entity])],
  controllers: [ReadLinkV1Controller],
  providers: [
    ReadLinkV1Service,
    {
      provide: SNIPLY_LINK_V1_READ,
      useClass: ReadLinkV1PostgresqlService,
    },
  ],
})
export class ReadLinkV1Module {}
