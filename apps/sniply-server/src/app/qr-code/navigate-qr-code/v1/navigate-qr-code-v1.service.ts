import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  ISniplyQrCodeV1Navigate,
  ISniplyQrCodeV1ScanCreate,
  ISniplyQrScanV1,
} from '@sniply/interfaces';
import { createHash, randomUUID } from 'crypto';
import {
  SNIPLY_QR_CODE_V1_NAVIGATE,
  SNIPLY_QR_CODE_V1_SCAN_CREATE,
} from './navigate-qr-code-v1.tokens';
import { NavigateQrCodeV1Helper } from './navigate-qr-code-v1.helper';

type NavigateQrCodeV1Context = {
  domain?: string;
  ip?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  deviceType?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  requestId?: string;
};

@Injectable()
export class NavigateQrCodeV1Service {
  constructor(
    @Inject(SNIPLY_QR_CODE_V1_NAVIGATE)
    private readonly navigator: ISniplyQrCodeV1Navigate,
    @Inject(SNIPLY_QR_CODE_V1_SCAN_CREATE)
    private readonly scanCreator: ISniplyQrCodeV1ScanCreate,
    private readonly helper: NavigateQrCodeV1Helper,
  ) {}

  async resolveAndTrack(code: string, context: NavigateQrCodeV1Context) {
    const record = await this.navigator.findByCode(code, context.domain);
    if (!record) {
      throw new BadRequestException('QR code not found');
    }

    this.helper.validate(record);

    void this.navigator.incrementScan(record.id).catch((err) => this.logAsyncError('incrementScan', err));
    void this.scanCreator.create(this.buildScanEvent(record.id, context)).catch((err) => this.logAsyncError('createScan', err));

    return record.target_url;
  }

  private buildScanEvent(qrCodeId: string, context: NavigateQrCodeV1Context): ISniplyQrScanV1 {
    return {
      qr_code_id: qrCodeId,
      ip_hash: this.hashValue(context.ip ?? ''),
      user_agent: context.userAgent ?? '',
      referrer: context.referrer ?? '',
      country: context.country ?? null,
      device_type: context.deviceType ?? null,
      utm_source: context.utmSource ?? null,
      utm_medium: context.utmMedium ?? null,
      utm_campaign: context.utmCampaign ?? null,
      utm_term: context.utmTerm ?? null,
      utm_content: context.utmContent ?? null,
      request_id: context.requestId ?? randomUUID(),
    };
  }

  private hashValue(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }

  private logAsyncError(action: string, err: unknown) {
    // eslint-disable-next-line no-console
    console.error(`[NavigateQrCodeV1Service] ${action} failed`, err);
  }
}
