export interface ISniplyQrCodeV1CreateRequest {
  targetUrl: string;
  domain?: string;
  customAlias?: string;
  expiresAt?: string;
  label?: string;
  foregroundColor?: string;
}
