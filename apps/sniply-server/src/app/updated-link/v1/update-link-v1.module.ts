import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateLinkV1Controller } from './update-link-v1.controller';
import { UpdateLinkV1Service } from './update-link-v1.service';
import { UpdateLinkV1PostgresqlService, SniplyLinkV1Entity } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_UPDATE } from './update-link-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyLinkV1Entity])],
  controllers: [UpdateLinkV1Controller],
  providers: [
    UpdateLinkV1Service,
    {
      provide: SNIPLY_LINK_V1_UPDATE,
      useClass: UpdateLinkV1PostgresqlService,
    },
  ],
})
export class UpdateLinkV1Module {}
