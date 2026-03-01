import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SniplyQrCodeV1Entity } from '@sniply/interfaces';
import { ListQrCodesV1Controller } from './list-qr-codes-v1.controller';
import { ListQrCodesV1Helper } from './list-qr-codes-v1.helper';
import { ListQrCodesV1Service } from './list-qr-codes-v1.service';

@Module({
  imports: [TypeOrmModule.forFeature([SniplyQrCodeV1Entity])],
  controllers: [ListQrCodesV1Controller],
  providers: [ListQrCodesV1Service, ListQrCodesV1Helper],
})
export class ListQrCodesV1Module {}
