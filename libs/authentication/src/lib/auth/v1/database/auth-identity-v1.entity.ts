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

@Entity('auth_identities')
@Index('auth_identities_provider_user_id_uq', ['provider', 'provider_user_id'], {
  unique: true,
})
@Index('auth_identities_user_id_idx', ['user_id'])
export class AuthIdentityV1Entity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'varchar', length: 64 })
  provider!: string;

  @Column({ type: 'varchar', length: 255 })
  provider_user_id!: string;

  @Column({ type: 'varchar', length: 320, nullable: true })
  provider_email?: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date;

  @ManyToOne(() => AuthUserV1Entity, (user) => user.identities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: AuthUserV1Entity;
}
