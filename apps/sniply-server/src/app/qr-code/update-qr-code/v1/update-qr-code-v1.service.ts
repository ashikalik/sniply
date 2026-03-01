import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ISniplyQrCodeV1,
  ISniplyQrCodeV1Update,
  ISniplyQrCodeV1UpdateRequest,
} from '@sniply/interfaces';
import { toQrCodeResponse } from '@sniply/qr-code';
import { validateHttpUrl } from '../../../common/url-validation';
import { SNIPLY_QR_CODE_V1_UPDATE } from './update-qr-code-v1.tokens';

@Injectable()
export class UpdateQrCodeV1Service {
  constructor(
    @Inject(SNIPLY_QR_CODE_V1_UPDATE)
    private readonly updater: ISniplyQrCodeV1Update,
  ) {}

  async update(
    code: string,
    request: ISniplyQrCodeV1UpdateRequest,
    userId?: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException('Missing user in access token');
    }

    if (!code?.trim()) {
      throw new BadRequestException('code is required');
    }

    if (request.targetUrl !== undefined && !request.targetUrl.trim()) {
      throw new BadRequestException('targetUrl cannot be empty');
    }
    if (request.targetUrl !== undefined) {
      validateHttpUrl(request.targetUrl);
    }

    const patch: Partial<ISniplyQrCodeV1> = {};
    if (request.targetUrl !== undefined) {
      patch.target_url = request.targetUrl.trim();
    }
    if (request.expiresAt !== undefined) {
      patch.expires_at = request.expiresAt ? new Date(request.expiresAt) : null;
    }
    if (request.isActive !== undefined) {
      patch.is_active = request.isActive;
    }
    if (request.label !== undefined) {
      patch.label = request.label?.trim() || null;
    }
    if (request.foregroundColor !== undefined) {
      patch.foreground_color = this.normalizeColor(request.foregroundColor);
    }

    const updated = await this.updater.updateByCode(code, patch, userId);
    if (!updated) {
      throw new BadRequestException('QR code not found');
    }

    return toQrCodeResponse(updated);
  }

  private normalizeColor(color?: string | null) {
    if (!color?.trim()) {
      return null;
    }

    const trimmed = color.trim();
    if (!/^#?[0-9a-fA-F]{6}$/.test(trimmed)) {
      throw new BadRequestException('foregroundColor must be a 6-digit hex color');
    }

    return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  }
}
