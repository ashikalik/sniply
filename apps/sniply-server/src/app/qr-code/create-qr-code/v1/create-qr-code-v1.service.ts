import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ISniplyQrCodeV1,
  ISniplyQrCodeV1Create,
  ISniplyQrCodeV1CreateRequest,
} from '@sniply/interfaces';
import { toQrCodeResponse } from '@sniply/qr-code';
import { randomBytes } from 'crypto';
import { validateHttpUrl } from '../../../common/url-validation';
import { SNIPLY_QR_CODE_V1_CREATE } from './create-qr-code-v1.tokens';

@Injectable()
export class CreateQrCodeV1Service {
  constructor(
    @Inject(SNIPLY_QR_CODE_V1_CREATE)
    private readonly creator: ISniplyQrCodeV1Create,
  ) {}

  async create(request: ISniplyQrCodeV1CreateRequest, userId?: string) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    if (!request.targetUrl?.trim()) {
      throw new BadRequestException('targetUrl is required');
    }
    validateHttpUrl(request.targetUrl);

    if (request.customAlias && request.customAlias.length > 16) {
      throw new BadRequestException('customAlias must be <= 16 characters');
    }

    const code = request.customAlias ?? this.generateCode(6);
    const now = new Date();
    const record: Partial<ISniplyQrCodeV1> = {
      code,
      target_url: request.targetUrl.trim(),
      domain: request.domain?.trim() || null,
      label: request.label?.trim() || null,
      foreground_color: this.normalizeColor(request.foregroundColor),
      expires_at: request.expiresAt ? new Date(request.expiresAt) : null,
      is_active: true,
      scan_count: 0,
      created_by_user_id: userId,
      created_at: now,
      updated_at: now,
    };

    const saved = await this.creator.create(record as ISniplyQrCodeV1);
    return toQrCodeResponse(saved);
  }

  private normalizeColor(color?: string) {
    if (!color?.trim()) {
      return '#0f172a';
    }

    const trimmed = color.trim();
    if (!/^#?[0-9a-fA-F]{6}$/.test(trimmed)) {
      throw new BadRequestException('foregroundColor must be a 6-digit hex color');
    }

    return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  }

  private generateCode(length: number) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const bytes = randomBytes(length);
    let out = '';
    for (let i = 0; i < length; i += 1) {
      out += chars[bytes[i] % chars.length];
    }
    return out;
  }
}
