import { Module } from '@nestjs/common';
import { CreateLinkModule } from './create-link/create-link.module';
import { ReadLinkModule } from './read-link/read-link.module';
import { NavigateLinkModule } from './navigate-link/navigate-link.module';
import { UpdateLinkModule } from './update-link/update-link.module';
import { DeleteLinkModule } from './delete-link/delete-link.module';
import { LinkAnalyticsModule } from './link-analytics/link-analytics.module';
import { ListLinksModule } from './list-links/list-links.module';

@Module({
  imports: [
    CreateLinkModule,
    ReadLinkModule,
    NavigateLinkModule,
    UpdateLinkModule,
    DeleteLinkModule,
    LinkAnalyticsModule,
    ListLinksModule,
  ],
})
export class LinkModule {}
