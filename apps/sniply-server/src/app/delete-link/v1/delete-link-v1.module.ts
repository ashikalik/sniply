import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeleteLinkV1Controller } from './delete-link-v1.controller';
import { DeleteLinkV1Service } from './delete-link-v1.service';
import { DeleteLinkV1PostgresqlService, SniplyLinkV1Entity } from '@sniply/interfaces';
import { SNIPLY_LINK_V1_DELETE } from './delete-link-v1.tokens';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyLinkV1Entity])],
  controllers: [DeleteLinkV1Controller],
  providers: [
    DeleteLinkV1Service,
    {
      provide: SNIPLY_LINK_V1_DELETE,
      useClass: DeleteLinkV1PostgresqlService,
    },
  ],
})
export class DeleteLinkV1Module {}
