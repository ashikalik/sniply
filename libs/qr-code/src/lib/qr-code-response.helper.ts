import * as QRCode from 'qrcode';

export interface IQrCodeRecord {
  id: string;
  code: string;
  target_url: string;
  label?: string | null;
  foreground_color?: string | null;
  expires_at?: Date | null;
  created_at: Date;
}

export interface IQrCodeResponse {
  id: string;
  code: string;
  redirectUrl: string;
  qrImageUrl: string;
  targetUrl: string;
  label: string | null;
  foregroundColor: string | null;
  expiresAt: string | null;
  createdAt: string | null;
}

export async function toQrCodeResponse(
  record: IQrCodeRecord,
): Promise<IQrCodeResponse> {
  const redirectUrl = buildRedirectUrl(record.code);
  const foregroundColor = record.foreground_color ?? '#0f172a';

  return {
    id: record.id,
    code: record.code,
    redirectUrl,
    qrImageUrl: await buildQrImageDataUrl(redirectUrl, foregroundColor),
    targetUrl: record.target_url,
    label: record.label ?? null,
    foregroundColor,
    expiresAt: record.expires_at?.toISOString() ?? null,
    createdAt: record.created_at?.toISOString() ?? null,
  };
}

export function buildRedirectUrl(code: string) {
  const baseUrl = process.env['SHORT_BASE_URL'] ?? 'http://localhost:3001';
  return `${baseUrl.replace(/\/$/, '')}/q/${code}`;
}

async function buildQrImageDataUrl(
  redirectUrl: string,
  foregroundColor: string,
) {
  return QRCode.toDataURL(redirectUrl, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 256,
    color: {
      dark: normalizeHexColor(foregroundColor),
      light: '#FFFFFFFF',
    },
  });
}

function normalizeHexColor(color: string) {
  const trimmed = color.trim();
  const prefixed = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
  return prefixed.length === 7 ? `${prefixed}FF` : prefixed;
}
