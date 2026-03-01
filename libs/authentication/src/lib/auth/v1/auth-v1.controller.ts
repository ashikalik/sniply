import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { CookieOptions } from 'express';
import { AuthV1Service } from './auth-v1.service';
import { AccessTokenGuard, IAuthRequest } from '../../common/access-token.guard';

@Controller('auth/v1')
export class AuthV1Controller {
  constructor(
    private readonly service: AuthV1Service,
    private readonly configService: ConfigService,
  ) {}

  @Post('register/email')
  registerEmail(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.service.registerEmail(body).then((session) => {
      this.setRefreshCookie(res, session.refreshToken, session.refreshTokenExpiresAt);
      return session;
    });
  }

  @Post('login/email')
  loginEmail(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'];
    return this.service
      .loginEmail({
      email: body.email,
      password: body.password,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      ip: req.ip,
      })
      .then((session) => {
        this.setRefreshCookie(
          res,
          session.refreshToken,
          session.refreshTokenExpiresAt,
        );
        return session;
      });
  }

  @Post('login/google')
  loginGoogle(
    @Body() body: { idToken: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'];
    return this.service
      .loginGoogle({
      idToken: body.idToken,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      ip: req.ip,
      })
      .then((session) => {
        this.setRefreshCookie(
          res,
          session.refreshToken,
          session.refreshTokenExpiresAt,
        );
        return session;
      });
  }

  @Post('refresh')
  refresh(
    @Body() body: { refreshToken?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = body.refreshToken ?? this.getCookie(req, this.refreshCookieName);
    const userAgent = req.headers['user-agent'];
    return this.service
      .refresh({
        refreshToken,
        userAgent: typeof userAgent === 'string' ? userAgent : undefined,
        ip: req.ip,
      })
      .then((session) => {
        this.setRefreshCookie(
          res,
          session.refreshToken,
          session.refreshTokenExpiresAt,
        );
        return session;
      });
  }

  @Post('logout')
  logout(
    @Body() body: { refreshToken?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = body.refreshToken ?? this.getCookie(req, this.refreshCookieName);
    this.clearRefreshCookie(res);
    return this.service.logout({ refreshToken });
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout-all')
  logoutAll(
    @Req() req: IAuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sub = req.authUser?.sub;
    if (!sub) {
      throw new UnauthorizedException('Missing user in access token');
    }

    this.clearRefreshCookie(res);
    return this.service.logoutAll(sub);
  }

  @Post('verify-email')
  verifyEmail(@Body() body: { token: string }) {
    return this.service.verifyEmail(body);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: { email: string }) {
    return this.service.forgotPassword(body);
  }

  @Post('reset-password')
  resetPassword(
    @Body() body: { token: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    this.clearRefreshCookie(res);
    return this.service.resetPassword(body);
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  me(@Req() req: IAuthRequest) {
    const sub = req.authUser?.sub;
    if (!sub) {
      throw new UnauthorizedException('Missing user in access token');
    }

    return this.service.me(sub);
  }

  private setRefreshCookie(
    res: Response,
    refreshToken: string,
    refreshTokenExpiresAt: string,
  ) {
    const expires = new Date(refreshTokenExpiresAt);
    res.cookie(this.refreshCookieName, refreshToken, {
      ...this.getRefreshCookieOptions(),
      expires: Number.isNaN(expires.getTime()) ? undefined : expires,
    });
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie(this.refreshCookieName, this.getRefreshCookieOptions());
  }

  private getCookie(req: Request, name: string): string | undefined {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return undefined;
    }

    const pairs = cookieHeader.split(';');
    for (const pair of pairs) {
      const [rawName, ...valueParts] = pair.trim().split('=');
      if (rawName === name) {
        return decodeURIComponent(valueParts.join('='));
      }
    }

    return undefined;
  }

  private get refreshCookieName() {
    return (
      this.configService.get<string>('AUTH_REFRESH_COOKIE_NAME')?.trim() ||
      'sniply_refresh_token'
    );
  }

  private getRefreshCookieOptions(): CookieOptions {
    const secure = this.getBooleanEnv(
      'AUTH_COOKIE_SECURE',
      this.isProductionEnvironment(),
    );
    const sameSite = this.getSameSiteEnv(
      'AUTH_COOKIE_SAME_SITE',
      secure ? 'none' : 'lax',
    );
    const domain = this.configService.get<string>('AUTH_COOKIE_DOMAIN')?.trim() || undefined;
    const path = this.configService.get<string>('AUTH_COOKIE_PATH')?.trim() || '/';

    return {
      httpOnly: true,
      secure,
      sameSite,
      domain,
      path,
    };
  }

  private getBooleanEnv(key: string, fallback: boolean) {
    const value = this.configService.get<string>(key)?.trim().toLowerCase();
    if (!value) {
      return fallback;
    }

    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    return fallback;
  }

  private getSameSiteEnv(
    key: string,
    fallback: 'lax' | 'strict' | 'none',
  ): 'lax' | 'strict' | 'none' {
    const value = this.configService.get<string>(key)?.trim().toLowerCase();
    if (value === 'lax' || value === 'strict' || value === 'none') {
      return value;
    }

    return fallback;
  }

  private isProductionEnvironment() {
    return this.configService.get<string>('NODE_ENV')?.trim().toLowerCase() === 'production';
  }
}
