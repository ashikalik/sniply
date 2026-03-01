export interface ISniplyQrScanV1 {
  id?: string;
  qr_code_id: string;
  scanned_at?: Date;
  ip_hash: string;
  user_agent: string;
  referrer: string;
  country?: string | null;
  device_type?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  request_id: string;
}
