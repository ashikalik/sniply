import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashPassword, verifyPassword } from '../../common/password-hasher';
import { createOpaqueToken, hashToken } from '../../common/token-hasher';
import { AuthJwtService } from '../../common/auth-jwt.service';
import {
  AuthEmailVerificationTokenV1Entity,
  AuthIdentityV1Entity,
  AuthPasswordResetTokenV1Entity,
  AuthSessionV1Entity,
  AuthUserV1Entity,
} from './database';
import { AUTH_V1_EXTERNAL_PROVIDER_GOOGLE } from './auth-v1.tokens';
import { IExternalAuthV1Provider } from './providers/external-auth-provider-v1.interface';

interface IRegisterEmailBody {
  email: string;
  password: string;
}

interface ILoginEmailBody {
  email: string;
  password: string;
  userAgent?: string;
  ip?: string;
}

interface ILoginGoogleBody {
  idToken: string;
  userAgent?: string;
  ip?: string;
}

interface IRefreshBody {
  refreshToken?: string;
  userAgent?: string;
  ip?: string;
}

interface ILogoutBody {
  refreshToken?: string;
}

@Injectable()
export class AuthV1Service {
  constructor(
    @InjectRepository(AuthUserV1Entity)
    private readonly users: Repository<AuthUserV1Entity>,
    @InjectRepository(AuthIdentityV1Entity)
    private readonly identities: Repository<AuthIdentityV1Entity>,
    @InjectRepository(AuthSessionV1Entity)
    private readonly sessions: Repository<AuthSessionV1Entity>,
    @InjectRepository(AuthEmailVerificationTokenV1Entity)
    private readonly emailVerificationTokens: Repository<AuthEmailVerificationTokenV1Entity>,
    @InjectRepository(AuthPasswordResetTokenV1Entity)
    private readonly passwordResetTokens: Repository<AuthPasswordResetTokenV1Entity>,
    private readonly configService: ConfigService,
    private readonly jwtService: AuthJwtService,
    @Inject(AUTH_V1_EXTERNAL_PROVIDER_GOOGLE)
    private readonly googleProvider: IExternalAuthV1Provider,
  ) {}

  async registerEmail(body: IRegisterEmailBody) {
    const email = this.normalizeEmail(body.email);
    this.assertStrongPassword(body.password);

    const existing = await this.users.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('Account already exists');
    }

    const user = this.users.create({
      email,
      password_hash: hashPassword(body.password),
      status: 'active',
      email_verified_at: null,
    });

    const savedUser = await this.users.save(user);

    await this.identities.save(
      this.identities.create({
        user_id: savedUser.id,
        provider: 'local',
        provider_user_id: savedUser.id,
        provider_email: email,
      }),
    );

    const verifyToken = createOpaqueToken();
    await this.emailVerificationTokens.save(
      this.emailVerificationTokens.create({
        user_id: savedUser.id,
        token_hash: hashToken(verifyToken),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      }),
    );

    return {
      ...(await this.issueSession(savedUser, {
        userAgent: undefined,
        ip: undefined,
      })),
      verifyEmailToken: verifyToken,
    };
  }

  async logoutAll(userId: string) {
    await this.sessions
      .createQueryBuilder()
      .update(AuthSessionV1Entity)
      .set({ revoked_at: new Date() })
      .where('user_id = :userId', { userId })
      .andWhere('revoked_at IS NULL')
      .execute();

    return { success: true };
  }

  async verifyEmail(body: { token: string }) {
    if (!body.token?.trim()) {
      throw new BadRequestException('token is required');
    }

    const tokenHash = hashToken(body.token);
    const token = await this.emailVerificationTokens.findOne({
      where: { token_hash: tokenHash },
    });

    if (!token || token.used_at || token.expires_at <= new Date()) {
      throw new UnauthorizedException('Invalid verification token');
    }

    token.used_at = new Date();
    await this.emailVerificationTokens.save(token);

    await this.users.update(
      { id: token.user_id },
      { email_verified_at: new Date() },
    );

    return { success: true };
  }

  async forgotPassword(body: { email: string }) {
    const email = this.normalizeEmail(body.email);
    const user = await this.users.findOne({ where: { email } });

    if (!user) {
      return { success: true };
    }

    const resetToken = createOpaqueToken();
    await this.passwordResetTokens.save(
      this.passwordResetTokens.create({
        user_id: user.id,
        token_hash: hashToken(resetToken),
        expires_at: new Date(Date.now() + 60 * 60 * 1000),
      }),
    );

    return {
      success: true,
      resetToken,
    };
  }

  async resetPassword(body: { token: string; password: string }) {
    if (!body.token?.trim()) {
      throw new BadRequestException('token is required');
    }
    this.assertStrongPassword(body.password);

    const tokenHash = hashToken(body.token);
    const token = await this.passwordResetTokens.findOne({
      where: { token_hash: tokenHash },
    });

    if (!token || token.used_at || token.expires_at <= new Date()) {
      throw new UnauthorizedException('Invalid reset token');
    }

    token.used_at = new Date();
    await this.passwordResetTokens.save(token);

    await this.users.update(
      { id: token.user_id },
      { password_hash: hashPassword(body.password) },
    );

    await this.sessions
      .createQueryBuilder()
      .update(AuthSessionV1Entity)
      .set({ revoked_at: new Date() })
      .where('user_id = :userId', { userId: token.user_id })
      .andWhere('revoked_at IS NULL')
      .execute();

    return { success: true };
  }

  async loginEmail(body: ILoginEmailBody) {
    const email = this.normalizeEmail(body.email);
    const user = await this.users.findOne({ where: { email } });

    if (!user?.password_hash || !verifyPassword(body.password, user.password_hash)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.issueSession(user, {
      userAgent: body.userAgent,
      ip: body.ip,
    });
  }

  async loginGoogle(body: ILoginGoogleBody) {
    if (!body.idToken?.trim()) {
      throw new BadRequestException('idToken is required');
    }

    const external = await this.googleProvider.verify(body.idToken);
    if (!external.emailVerified) {
      throw new UnauthorizedException('Google email is not verified');
    }

    let identity = await this.identities.findOne({
      where: {
        provider: external.provider,
        provider_user_id: external.providerUserId,
      },
      relations: ['user'],
    });

    let user = identity?.user;

    if (!user) {
      const normalizedEmail = this.normalizeEmail(external.email);
      user =
        (await this.users.findOne({ where: { email: normalizedEmail } })) ??
        undefined;

      if (!user) {
        user = await this.users.save(
          this.users.create({
            email: normalizedEmail,
            password_hash: null,
            email_verified_at: new Date(),
            status: 'active',
          }),
        );
      }

      identity = this.identities.create({
        user_id: user.id,
        provider: external.provider,
        provider_user_id: external.providerUserId,
        provider_email: normalizedEmail,
      });
      await this.identities.save(identity);
    }

    return this.issueSession(user, {
      userAgent: body.userAgent,
      ip: body.ip,
    });
  }

  async refresh(body: IRefreshBody) {
    if (!body.refreshToken?.trim()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const now = new Date();
    const refreshTokenHash = hashToken(body.refreshToken);

    const session = await this.sessions.findOne({
      where: { refresh_token_hash: refreshTokenHash },
      relations: ['user'],
    });

    if (!session || session.revoked_at || session.expires_at <= now) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    session.revoked_at = now;
    session.last_used_at = now;
    await this.sessions.save(session);

    const issued = await this.issueSession(session.user, {
      userAgent: body.userAgent ?? session.user_agent ?? undefined,
      ip: body.ip ?? session.ip ?? undefined,
    });

    const newSession = await this.sessions.findOne({
      where: { id: issued.sessionId },
    });

    if (newSession) {
      session.replaced_by_session_id = newSession.id;
      await this.sessions.save(session);
    }

    return issued;
  }

  async logout(body: ILogoutBody) {
    if (!body.refreshToken?.trim()) {
      return { success: true };
    }

    const refreshTokenHash = hashToken(body.refreshToken);
    const session = await this.sessions.findOne({
      where: { refresh_token_hash: refreshTokenHash },
    });

    if (!session) {
      return { success: true };
    }

    if (!session.revoked_at) {
      session.revoked_at = new Date();
      await this.sessions.save(session);
    }

    return { success: true };
  }

  async me(userId: string) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      emailVerifiedAt: user.email_verified_at?.toISOString() ?? null,
      status: user.status,
      createdAt: user.created_at.toISOString(),
    };
  }

  private async issueSession(
    user: AuthUserV1Entity,
    meta: { userAgent?: string; ip?: string },
  ) {
    const now = new Date();
    const refreshTtlSec = Number(
      this.configService.get<string>('AUTH_REFRESH_TTL_SEC') ?? '2592000',
    );

    const refreshToken = createOpaqueToken();
    const refreshTokenHash = hashToken(refreshToken);

    const session = await this.sessions.save(
      this.sessions.create({
        user_id: user.id,
        refresh_token_hash: refreshTokenHash,
        user_agent: meta.userAgent ?? null,
        ip: meta.ip ?? null,
        device_name: null,
        expires_at: new Date(now.getTime() + refreshTtlSec * 1000),
        revoked_at: null,
        last_used_at: now,
      }),
    );

    const access = this.jwtService.createAccessToken({
      sub: user.id,
      sid: session.id,
      email: user.email,
    });

    return {
      tokenType: 'Bearer',
      accessToken: access.token,
      accessTokenExpiresInSec: access.expiresIn,
      refreshToken,
      refreshTokenExpiresAt: session.expires_at.toISOString(),
      sessionId: session.id,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  private normalizeEmail(email: string) {
    const normalized = email?.trim().toLowerCase();
    if (!normalized) {
      throw new BadRequestException('email is required');
    }
    return normalized;
  }

  private assertStrongPassword(password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException('password must be at least 8 characters');
    }
  }
}
