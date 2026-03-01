export interface ISniplyQrCodeV1 {
  id: string;
  code: string;
  target_url: string;
  domain?: string | null;
  label?: string | null;
  foreground_color?: string | null;
  created_by_user_id?: string | null;
  is_active: boolean;
  expires_at?: Date | null;
  scan_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
