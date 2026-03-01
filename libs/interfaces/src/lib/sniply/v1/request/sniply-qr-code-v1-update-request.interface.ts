export interface ISniplyQrCodeV1UpdateRequest {
  isActive?: boolean;
  targetUrl?: string;
  expiresAt?: string | null;
  label?: string | null;
  foregroundColor?: string | null;
}
