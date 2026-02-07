import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLinkClicks20260207140959 implements MigrationInterface {
  name = 'CreateLinkClicks20260207140959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS link_clicks (
        id bigserial PRIMARY KEY,
        short_link_id uuid NOT NULL,
        clicked_at timestamptz NOT NULL DEFAULT now(),
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
      `CREATE INDEX IF NOT EXISTS link_clicks_short_link_id_clicked_at_idx ON link_clicks(short_link_id, clicked_at DESC);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS link_clicks_clicked_at_idx ON link_clicks(clicked_at);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS link_clicks_clicked_at_idx;`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS link_clicks_short_link_id_clicked_at_idx;`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS link_clicks;`);
  }
}
