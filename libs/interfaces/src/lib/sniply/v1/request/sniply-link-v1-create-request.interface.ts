export interface ISniplyLinkV1CreateRequest {
  longUrl: string;
  customAlias?: string;
  expiresAt?: string;
  maxClicks?: number;
  password?: string;
}
