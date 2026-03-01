import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sniply_qr_codes')
@Index('sniply_qr_codes_code_uq', ['code'], { unique: true })
@Index('sniply_qr_codes_domain_code_uq', ['domain', 'code'], { unique: true })
@Index('sniply_qr_codes_expires_at_idx', ['expires_at'])
@Index('sniply_qr_codes_created_by_user_id_idx', ['created_by_user_id'])
export class SniplyQrCodeV1Entity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 16 })
  code!: string;

  @Column({ type: 'text' })
  target_url!: string;

  @Column({ type: 'varchar', nullable: true })
  domain?: string | null;

  @Column({ type: 'varchar', nullable: true })
  label?: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  foreground_color?: string | null;

  @Column({ type: 'uuid', nullable: true })
  created_by_user_id?: string | null;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  expires_at?: Date | null;

  @Column({
    type: 'bigint',
    default: 0,
    transformer: {
      to: (value?: number) => value,
      from: (value: string) => Number(value),
    },
  })
  scan_count!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date | null;
}
