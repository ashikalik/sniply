import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthCore20260222160000 implements MigrationInterface {
  name = 'CreateAuthCore20260222160000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth_users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(320) NOT NULL,
        password_hash varchar NULL,
        email_verified_at timestamptz NULL,
        status varchar NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS auth_users_email_uq
      ON auth_users (email);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth_identities (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        provider varchar(64) NOT NULL,
        provider_user_id varchar(255) NOT NULL,
        provider_email varchar(320) NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS auth_identities_provider_user_id_uq
      ON auth_identities (provider, provider_user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS auth_identities_user_id_idx
      ON auth_identities (user_id);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        refresh_token_hash varchar(128) NOT NULL,
        user_agent varchar NULL,
        ip varchar NULL,
        device_name varchar NULL,
        expires_at timestamptz NOT NULL,
        revoked_at timestamptz NULL,
        last_used_at timestamptz NULL,
        replaced_by_session_id uuid NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS auth_sessions_token_hash_uq
      ON auth_sessions (refresh_token_hash);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS auth_sessions_user_id_idx
      ON auth_sessions (user_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS auth_sessions_expires_at_idx
      ON auth_sessions (expires_at);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth_email_verification_tokens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        token_hash varchar(128) NOT NULL,
        expires_at timestamptz NOT NULL,
        used_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS auth_email_verification_tokens_token_hash_uq
      ON auth_email_verification_tokens (token_hash);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS auth_email_verification_tokens_user_id_idx
      ON auth_email_verification_tokens (user_id);
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS auth_password_reset_tokens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth_users(id) ON DELETE CASCADE,
        token_hash varchar(128) NOT NULL,
        expires_at timestamptz NOT NULL,
        used_at timestamptz NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS auth_password_reset_tokens_token_hash_uq
      ON auth_password_reset_tokens (token_hash);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS auth_password_reset_tokens_user_id_idx
      ON auth_password_reset_tokens (user_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS auth_password_reset_tokens CASCADE;`,
    );
    await queryRunner.query(
      `DROP TABLE IF EXISTS auth_email_verification_tokens CASCADE;`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS auth_sessions CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth_identities CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth_users CASCADE;`);
  }
}
