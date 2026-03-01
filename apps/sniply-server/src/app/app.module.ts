import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkModule } from './link/link.module';
import { QrCodeModule } from './qr-code/qr-code.module';
import { CreateSniplyLinks20260207122907 } from '../migrations/20260207122907-create-sniply-links';
import { CreateLinkClicks20260207140959 } from '../migrations/20260207140959-create-link-clicks';
import { CreateSniplyQrCodes20260301103000 } from '../migrations/20260301103000-create-sniply-qr-codes';
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
        CreateSniplyQrCodes20260301103000,
      ],
    }),
    LinkModule,
    QrCodeModule,
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
