import { Module } from '@nestjs/common';
import { NavigateLinkV1Module } from './v1/navigate-link-v1.module';

@Module({
  imports: [NavigateLinkV1Module],
})
export class NavigateLinkModule {}
