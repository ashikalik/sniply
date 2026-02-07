import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateLinkModule } from './create-link/create-link.module';
import { ReadLinkModule } from './read-link/read-link.module';
import { NavigateLinkModule } from './navigate-link/navigate-link.module';
import { CreateSniplyLinks20260207122907 } from '../migrations/20260207122907-create-sniply-links';

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
      migrations: [CreateSniplyLinks20260207122907],
    }),
    CreateLinkModule,
    ReadLinkModule,
    NavigateLinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
