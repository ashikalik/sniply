import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateLinkModule } from './create-link/create-link.module';

@Module({
  imports: [CreateLinkModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
