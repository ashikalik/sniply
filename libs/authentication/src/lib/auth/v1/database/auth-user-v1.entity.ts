import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthIdentityV1Entity } from './auth-identity-v1.entity';
import { AuthSessionV1Entity } from './auth-session-v1.entity';

@Entity('auth_users')
@Index('auth_users_email_uq', ['email'], { unique: true })
export class AuthUserV1Entity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 320 })
  email!: string;

  @Column({ type: 'varchar', nullable: true })
  password_hash?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  email_verified_at?: Date | null;

  @Column({ type: 'varchar', default: 'active' })
  status!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date;

  @OneToMany(() => AuthIdentityV1Entity, (identity) => identity.user)
  identities?: AuthIdentityV1Entity[];

  @OneToMany(() => AuthSessionV1Entity, (session) => session.user)
  sessions?: AuthSessionV1Entity[];
}
