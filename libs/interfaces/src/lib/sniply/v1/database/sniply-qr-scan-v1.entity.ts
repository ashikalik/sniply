import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('qr_code_scans')
@Index('qr_code_scans_qr_code_id_scanned_at_idx', ['qr_code_id', 'scanned_at'])
@Index('qr_code_scans_scanned_at_idx', ['scanned_at'])
export class SniplyQrScanV1Entity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'uuid' })
  qr_code_id!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  scanned_at!: Date;

  @Column({ type: 'varchar' })
  ip_hash!: string;

  @Column({ type: 'text' })
  user_agent!: string;

  @Column({ type: 'text' })
  referrer!: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  country?: string | null;

  @Column({ type: 'varchar', nullable: true })
  device_type?: string | null;

  @Column({ type: 'varchar', nullable: true })
  utm_source?: string | null;

  @Column({ type: 'varchar', nullable: true })
  utm_medium?: string | null;

  @Column({ type: 'varchar', nullable: true })
  utm_campaign?: string | null;

  @Column({ type: 'varchar', nullable: true })
  utm_term?: string | null;

  @Column({ type: 'varchar', nullable: true })
  utm_content?: string | null;

  @Column({ type: 'uuid' })
  request_id!: string;
}
