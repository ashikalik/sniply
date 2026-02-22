import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SniplyLinkV1Entity } from '@sniply/interfaces';
import { ListLinksV1Controller } from './list-links-v1.controller';
import { ListLinksV1Service } from './list-links-v1.service';
import { ListLinksV1Helper } from './list-links-v1.helper';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyLinkV1Entity])],
  controllers: [ListLinksV1Controller],
  providers: [ListLinksV1Service, ListLinksV1Helper],
})
export class ListLinksV1Module {}
