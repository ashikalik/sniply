import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('link_clicks')
@Index('link_clicks_short_link_id_clicked_at_idx', ['short_link_id', 'clicked_at'])
@Index('link_clicks_clicked_at_idx', ['clicked_at'])
export class SniplyLinkClickV1Entity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: string;

  @Column({ type: 'uuid' })
  short_link_id!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  clicked_at!: Date;

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
