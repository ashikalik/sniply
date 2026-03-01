import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sniply_links')
@Index('sniply_links_code_uq', ['code'], { unique: true })
@Index('sniply_links_domain_code_uq', ['domain', 'code'], { unique: true })
@Index('sniply_links_expires_at_idx', ['expires_at'])
@Index('sniply_links_created_by_user_id_idx', ['created_by_user_id'])
export class SniplyLinkV1Entity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 16 })
  code!: string;

  @Column({ type: 'text' })
  long_url!: string;

  @Column({ type: 'varchar', nullable: true })
  domain?: string | null;

  @Column({ type: 'varchar', nullable: true })
  title?: string | null;

  @Column({ type: 'uuid' })
  created_by_user_id!: string;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  expires_at?: Date | null;

  @Column({ type: 'int', nullable: true })
  max_clicks?: number | null;

  @Column({
    type: 'bigint',
    default: 0,
    transformer: {
      to: (value?: number) => value,
      from: (value: string) => Number(value),
    },
  })
  click_count!: number;

  @Column({ type: 'varchar', nullable: true })
  password_hash?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date | null;
}
