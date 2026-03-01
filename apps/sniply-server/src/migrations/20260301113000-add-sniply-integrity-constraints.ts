import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSniplyIntegrityConstraints20260301113000 implements MigrationInterface {
  name = 'AddSniplyIntegrityConstraints20260301113000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM qr_code_scans scans
      WHERE NOT EXISTS (
        SELECT 1
        FROM sniply_qr_codes qr
        WHERE qr.id = scans.qr_code_id
      );
    `);

    await queryRunner.query(`
      DELETE FROM sniply_qr_codes qr
      WHERE qr.created_by_user_id IS NULL
         OR NOT EXISTS (
           SELECT 1
           FROM auth_users users
           WHERE users.id = qr.created_by_user_id
         );
    `);

    await queryRunner.query(`
      DELETE FROM sniply_links links
      WHERE links.created_by_user_id IS NULL
         OR NOT EXISTS (
           SELECT 1
           FROM auth_users users
           WHERE users.id = links.created_by_user_id
         );
    `);

    await queryRunner.query(`
      ALTER TABLE sniply_links
      ALTER COLUMN created_by_user_id SET NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE sniply_qr_codes
      ALTER COLUMN created_by_user_id SET NOT NULL;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'sniply_links_created_by_user_id_fk'
        ) THEN
          ALTER TABLE sniply_links
          ADD CONSTRAINT sniply_links_created_by_user_id_fk
          FOREIGN KEY (created_by_user_id)
          REFERENCES auth_users(id)
          ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'sniply_qr_codes_created_by_user_id_fk'
        ) THEN
          ALTER TABLE sniply_qr_codes
          ADD CONSTRAINT sniply_qr_codes_created_by_user_id_fk
          FOREIGN KEY (created_by_user_id)
          REFERENCES auth_users(id)
          ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'qr_code_scans_qr_code_id_fk'
        ) THEN
          ALTER TABLE qr_code_scans
          ADD CONSTRAINT qr_code_scans_qr_code_id_fk
          FOREIGN KEY (qr_code_id)
          REFERENCES sniply_qr_codes(id)
          ON DELETE CASCADE;
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE qr_code_scans
      DROP CONSTRAINT IF EXISTS qr_code_scans_qr_code_id_fk;
    `);

    await queryRunner.query(`
      ALTER TABLE sniply_qr_codes
      DROP CONSTRAINT IF EXISTS sniply_qr_codes_created_by_user_id_fk;
    `);

    await queryRunner.query(`
      ALTER TABLE sniply_links
      DROP CONSTRAINT IF EXISTS sniply_links_created_by_user_id_fk;
    `);

    await queryRunner.query(`
      ALTER TABLE sniply_qr_codes
      ALTER COLUMN created_by_user_id DROP NOT NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE sniply_links
      ALTER COLUMN created_by_user_id DROP NOT NULL;
    `);
  }
}
