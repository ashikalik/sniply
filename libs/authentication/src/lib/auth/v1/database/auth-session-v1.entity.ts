import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthUserV1Entity } from './auth-user-v1.entity';

@Entity('auth_sessions')
@Index('auth_sessions_user_id_idx', ['user_id'])
@Index('auth_sessions_expires_at_idx', ['expires_at'])
@Index('auth_sessions_token_hash_uq', ['refresh_token_hash'], { unique: true })
export class AuthSessionV1Entity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 128 })
  refresh_token_hash!: string;

  @Column({ type: 'varchar', nullable: true })
  user_agent?: string | null;

  @Column({ type: 'varchar', nullable: true })
  ip?: string | null;

  @Column({ type: 'varchar', nullable: true })
  device_name?: string | null;

  @Column({ type: 'timestamptz' })
  expires_at!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revoked_at?: Date | null;

  @Column({ type: 'timestamptz', nullable: true })
  last_used_at?: Date | null;

  @Column({ type: 'uuid', nullable: true })
  replaced_by_session_id?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @ManyToOne(() => AuthUserV1Entity, (user) => user.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: AuthUserV1Entity;
}
