import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SniplyQrCodeV1Entity } from './sniply-qr-code-v1.entity';
import { ISniplyQrCodeV1 } from './sniply-qr-code-v1-db.interface';
import { ISniplyQrCodeV1Create } from '../service/sniply-qr-code-v1-create.interface';

@Injectable()
export class CreateQrCodeV1PostgresqlService implements ISniplyQrCodeV1Create {
  constructor(
    @InjectRepository(SniplyQrCodeV1Entity)
    private readonly repo: Repository<SniplyQrCodeV1Entity>,
  ) {}

  async create(qrCode: ISniplyQrCodeV1): Promise<ISniplyQrCodeV1> {
    const entity = this.repo.create(qrCode);
    return this.repo.save(entity);
  }
}
