import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSniplyLinks20260207122907 implements MigrationInterface {
  name = 'CreateSniplyLinks20260207122907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS sniply_links (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        code varchar(16) NOT NULL,
        long_url text NOT NULL,
        domain varchar NULL,
        title varchar NULL,
        created_by_user_id uuid NULL,
        is_active boolean NOT NULL DEFAULT true,
        expires_at timestamptz NULL,
        max_clicks int NULL,
        click_count bigint NOT NULL DEFAULT 0,
        password_hash varchar NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      );
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS sniply_links_code_uq ON sniply_links(code);`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS sniply_links_domain_code_uq ON sniply_links(domain, code);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS sniply_links_expires_at_idx ON sniply_links(expires_at);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS sniply_links_created_by_user_id_idx ON sniply_links(created_by_user_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS sniply_links_created_by_user_id_idx;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS sniply_links_expires_at_idx;`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS sniply_links_domain_code_uq;`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS sniply_links_code_uq;`);
    await queryRunner.query(`DROP TABLE IF EXISTS sniply_links;`);
  }
}
