export interface ISniplyLinkV1 {
  id: string;
  code: string;
  long_url: string;
  domain?: string | null;
  title?: string | null;
  created_by_user_id?: string | null;
  is_active: boolean;
  expires_at?: Date | null;
  max_clicks?: number | null;
  click_count: number;
  password_hash?: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
