import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateLinkModule } from './create-link/create-link.module';
import { ReadLinkModule } from './read-link/read-link.module';
import { NavigateLinkModule } from './navigate-link/navigate-link.module';
import { UpdatedLinkModule } from './updated-link/updated-link.module';
import { DeleteLinkModule } from './delete-link/delete-link.module';
import { LinkAnalyticsModule } from './link-analytics/link-analytics.module';
import { ListLinksModule } from './list-links/list-links.module';
import { CreateSniplyLinks20260207122907 } from '../migrations/20260207122907-create-sniply-links';
import { CreateLinkClicks20260207140959 } from '../migrations/20260207140959-create-link-clicks';
import { JwtAuthGuard } from '@sniply/authentication';
import { JwtVerifierService } from '@sniply/authentication';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/sniply-server/.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      migrations: [
        CreateSniplyLinks20260207122907,
        CreateLinkClicks20260207140959,
      ],
    }),
    CreateLinkModule,
    UpdatedLinkModule,
    ReadLinkModule,
    NavigateLinkModule,
    DeleteLinkModule,
    LinkAnalyticsModule,
    ListLinksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtVerifierService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
