import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthV1Service } from './auth-v1.service';
import { AccessTokenGuard, IAuthRequest } from '../../common/access-token.guard';

@Controller('auth/v1')
export class AuthV1Controller {
  constructor(private readonly service: AuthV1Service) {}

  @Post('register/email')
  registerEmail(
    @Body() body: { email: string; password: string },
  ) {
    return this.service.registerEmail(body);
  }

  @Post('login/email')
  loginEmail(
    @Body() body: { email: string; password: string },
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];
    return this.service.loginEmail({
      email: body.email,
      password: body.password,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      ip: req.ip,
    });
  }

  @Post('login/google')
  loginGoogle(
    @Body() body: { idToken: string },
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];
    return this.service.loginGoogle({
      idToken: body.idToken,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      ip: req.ip,
    });
  }

  @Post('refresh')
  refresh(
    @Body() body: { refreshToken: string },
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];
    return this.service.refresh({
      refreshToken: body.refreshToken,
      userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      ip: req.ip,
    });
  }

  @Post('logout')
  logout(@Body() body: { refreshToken: string }) {
    return this.service.logout(body);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout-all')
  logoutAll(@Req() req: IAuthRequest) {
    const sub = req.authUser?.sub;
    if (!sub) {
      throw new UnauthorizedException('Missing user in access token');
    }

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
  resetPassword(@Body() body: { token: string; password: string }) {
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
}
