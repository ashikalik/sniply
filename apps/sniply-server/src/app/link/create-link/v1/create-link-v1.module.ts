import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateLinkV1Controller } from './create-link-v1.controller';
import { CreateLinkV1Service } from './create-link-v1.service';
import {
  CreateLinkV1PostgresqlService,
  SniplyLinkV1Entity,
} from '@sniply/interfaces';
import { SNIPLY_LINK_V1_CREATE } from './create-link-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyLinkV1Entity])],
  controllers: [CreateLinkV1Controller],
  providers: [
    CreateLinkV1Service,
    {
      provide: SNIPLY_LINK_V1_CREATE,
      useClass: CreateLinkV1PostgresqlService,
    },
  ],
})
export class CreateLinkV1Module {}
