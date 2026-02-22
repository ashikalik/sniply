import { Module } from '@nestjs/common';
import { ListLinksV1Module } from './v1/list-links-v1.module';

@Module({
  imports: [ListLinksV1Module],
})
export class ListLinksModule {}
