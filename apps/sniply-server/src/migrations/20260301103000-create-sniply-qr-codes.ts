import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSniplyQrCodes20260301103000 implements MigrationInterface {
  name = 'CreateSniplyQrCodes20260301103000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS sniply_qr_codes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        code varchar(16) NOT NULL,
        target_url text NOT NULL,
        domain varchar NULL,
        label varchar NULL,
        foreground_color varchar(32) NULL,
        created_by_user_id uuid NULL,
        is_active boolean NOT NULL DEFAULT true,
        expires_at timestamptz NULL,
        scan_count bigint NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS qr_code_scans (
        id bigserial PRIMARY KEY,
        qr_code_id uuid NOT NULL,
        scanned_at timestamptz NOT NULL DEFAULT now(),
        ip_hash varchar NOT NULL,
        user_agent text NOT NULL,
        referrer text NOT NULL,
        country varchar(2) NULL,
        device_type varchar NULL,
        utm_source varchar NULL,
        utm_medium varchar NULL,
        utm_campaign varchar NULL,
        utm_term varchar NULL,
        utm_content varchar NULL,
        request_id uuid NOT NULL
      );
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS sniply_qr_codes_code_uq ON sniply_qr_codes(code);`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS sniply_qr_codes_domain_code_uq ON sniply_qr_codes(domain, code);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS sniply_qr_codes_expires_at_idx ON sniply_qr_codes(expires_at);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS sniply_qr_codes_created_by_user_id_idx ON sniply_qr_codes(created_by_user_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS qr_code_scans_qr_code_id_scanned_at_idx ON qr_code_scans(qr_code_id, scanned_at DESC);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS qr_code_scans_scanned_at_idx ON qr_code_scans(scanned_at);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS qr_code_scans_scanned_at_idx;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS qr_code_scans_qr_code_id_scanned_at_idx;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS sniply_qr_codes_created_by_user_id_idx;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS sniply_qr_codes_expires_at_idx;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS sniply_qr_codes_domain_code_uq;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS sniply_qr_codes_code_uq;`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS qr_code_scans;`);
    await queryRunner.query(`DROP TABLE IF EXISTS sniply_qr_codes;`);
  }
}
