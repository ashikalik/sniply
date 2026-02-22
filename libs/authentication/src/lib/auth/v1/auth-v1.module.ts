import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthJwtService } from '../../common/auth-jwt.service';
import { AccessTokenGuard } from '../../common/access-token.guard';
import { AuthV1Controller } from './auth-v1.controller';
import { AuthV1Service } from './auth-v1.service';
import {
  AuthEmailVerificationTokenV1Entity,
  AuthIdentityV1Entity,
  AuthPasswordResetTokenV1Entity,
  AuthSessionV1Entity,
  AuthUserV1Entity,
} from './database';
import { GoogleAuthV1Provider } from './providers/google-auth-v1.provider';
import { AUTH_V1_EXTERNAL_PROVIDER_GOOGLE } from './auth-v1.tokens';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      AuthUserV1Entity,
      AuthIdentityV1Entity,
      AuthSessionV1Entity,
      AuthEmailVerificationTokenV1Entity,
      AuthPasswordResetTokenV1Entity,
    ]),
  ],
  controllers: [AuthV1Controller],
  providers: [
    AuthV1Service,
    AuthJwtService,
    AccessTokenGuard,
    GoogleAuthV1Provider,
    {
      provide: AUTH_V1_EXTERNAL_PROVIDER_GOOGLE,
      useExisting: GoogleAuthV1Provider,
    },
  ],
})
export class AuthV1Module {}
