import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISniplyQrScanV1 } from './sniply-qr-scan-v1-db.interface';
import { ISniplyQrCodeV1ScanCreate } from '../service/sniply-qr-code-v1-scan-create.interface';
import { SniplyQrScanV1Entity } from './sniply-qr-scan-v1.entity';

@Injectable()
export class CreateQrScanV1PostgresqlService implements ISniplyQrCodeV1ScanCreate {
  constructor(
    @InjectRepository(SniplyQrScanV1Entity)
    private readonly repo: Repository<SniplyQrScanV1Entity>,
  ) {}

  async create(scan: ISniplyQrScanV1): Promise<void> {
    const entity = this.repo.create(scan);
    await this.repo.save(entity);
  }
}
