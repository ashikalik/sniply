import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Repository } from 'typeorm';
import { ISniplyQrCodeV1Analytics } from '../service/sniply-qr-code-v1-analytics.interface';
import { SniplyQrScanV1Entity } from './sniply-qr-scan-v1.entity';
import { SniplyQrCodeV1Entity } from './sniply-qr-code-v1.entity';

@Injectable()
export class QrCodeAnalyticsV1PostgresqlService implements ISniplyQrCodeV1Analytics {
  constructor(
    @InjectRepository(SniplyQrCodeV1Entity)
    private readonly qrRepo: Repository<SniplyQrCodeV1Entity>,
    @InjectRepository(SniplyQrScanV1Entity)
    private readonly scanRepo: Repository<SniplyQrScanV1Entity>,
  ) {}

  async getByCode(code: string, userId: string, from?: Date, to?: Date) {
    const qrCode = await this.qrRepo.findOne({
      where: {
        code,
        created_by_user_id: userId,
        deleted_at: IsNull(),
      },
    });

    if (!qrCode) {
      return {
        code,
        from: from?.toISOString() ?? null,
        to: to?.toISOString() ?? null,
        total: 0,
        scans: [],
      };
    }

    const where: Record<string, unknown> = {
      qr_code_id: qrCode.id,
    };

    if (from && to) {
      where['scanned_at'] = Between(from, to);
    } else if (from) {
      where['scanned_at'] = Between(from, new Date(8640000000000000));
    } else if (to) {
      where['scanned_at'] = Between(new Date(0), to);
    }

    const [scans, total] = await this.scanRepo.findAndCount({
      where,
      order: { scanned_at: 'DESC' },
      take: 500,
    });

    return {
      code: qrCode.code,
      from: from?.toISOString() ?? null,
      to: to?.toISOString() ?? null,
      total,
      scans,
    };
  }
}
