import { Module } from '@nestjs/common';
import { CreateLinkV1Module } from './v1/create-link-v1.module';

@Module({
  imports: [CreateLinkV1Module],
})
export class CreateLinkModule {}
