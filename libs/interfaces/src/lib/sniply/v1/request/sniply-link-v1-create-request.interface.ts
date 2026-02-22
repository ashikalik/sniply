export interface ISniplyLinkV1CreateRequest {
  longUrl: string;
  domain?: string;
  customAlias?: string;
  expiresAt?: string;
  maxClicks?: number;
  password?: string;
}
