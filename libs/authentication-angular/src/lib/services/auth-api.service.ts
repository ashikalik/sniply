import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { AUTH_CLIENT_CONFIG, IAuthClientConfig } from '../config/auth-client.config';
import { IAuthSessionModel } from '../models/auth-session.model';
import { IAuthUserModel } from '../models/auth-user.model';
import { AuthStateService } from './auth-state.service';

export interface IRegisterEmailResponse extends IAuthSessionModel {
  verifyEmailToken?: string;
}

export interface IForgotPasswordResponse {
  success: boolean;
  resetToken?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly authState: AuthStateService,
    @Inject(AUTH_CLIENT_CONFIG) private readonly config: IAuthClientConfig,
  ) {}

  registerEmail(input: {
    email: string;
    password: string;
  }): Observable<IRegisterEmailResponse> {
    return this.http
      .post<IRegisterEmailResponse>(
        `${this.config.authBaseUrl}/auth/v1/register/email`,
        input,
        { withCredentials: true },
      )
      .pipe(
        switchMap((session) => this.withResolvedUser(session)),
        tap((session) =>
          this.authState.setSession(
            session.accessToken,
            session.user,
            session.refreshToken,
          ),
        ),
      );
  }

  loginEmail(input: { email: string; password: string }): Observable<IAuthSessionModel> {
    return this.http
      .post<IAuthSessionModel>(
        `${this.config.authBaseUrl}/auth/v1/login/email`,
        input,
        { withCredentials: true },
      )
      .pipe(
        switchMap((session) => this.withResolvedUser(session)),
        tap((session) =>
          this.authState.setSession(
            session.accessToken,
            session.user,
            session.refreshToken,
          ),
        ),
      );
  }

  loginGoogle(input: { idToken: string }): Observable<IAuthSessionModel> {
    return this.http
      .post<IAuthSessionModel>(
        `${this.config.authBaseUrl}/auth/v1/login/google`,
        input,
        { withCredentials: true },
      )
      .pipe(
        switchMap((session) => this.withResolvedUser(session)),
        tap((session) =>
          this.authState.setSession(
            session.accessToken,
            session.user,
            session.refreshToken,
          ),
        ),
      );
  }

  me(): Observable<IAuthUserModel> {
    const accessToken = this.authState.accessToken;
    return this.http
      .get<IAuthUserModel>(`${this.config.authBaseUrl}/auth/v1/me`, {
        withCredentials: true,
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      })
      .pipe(tap((user) => this.authState.setUser(user)));
  }

  refresh(): Observable<IAuthSessionModel> {
    const refreshToken = this.authState.refreshToken;
    return this.http
      .post<IAuthSessionModel>(
        `${this.config.authBaseUrl}/auth/v1/refresh`,
        refreshToken ? { refreshToken } : {},
        { withCredentials: true },
      )
      .pipe(
        switchMap((session) => this.withResolvedUser(session)),
        tap((session) =>
          this.authState.setSession(
            session.accessToken,
            session.user,
            session.refreshToken,
          ),
        ),
      );
  }

  logout(input?: { refreshToken?: string }): Observable<{ success: boolean }> {
    const payload = {
      ...(input ?? {}),
      refreshToken: input?.refreshToken ?? this.authState.refreshToken ?? undefined,
    };
    return this.http
      .post<{ success: boolean }>(
        `${this.config.authBaseUrl}/auth/v1/logout`,
        payload,
        { withCredentials: true },
      )
      .pipe(tap(() => this.authState.clearSession()));
  }

  logoutAll(): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(
        `${this.config.authBaseUrl}/auth/v1/logout-all`,
        {},
        { withCredentials: true },
      )
      .pipe(tap(() => this.authState.clearSession()));
  }

  verifyEmail(input: { token: string }): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.config.authBaseUrl}/auth/v1/verify-email`,
      input,
      { withCredentials: true },
    );
  }

  forgotPassword(input: { email: string }): Observable<IForgotPasswordResponse> {
    return this.http.post<IForgotPasswordResponse>(
      `${this.config.authBaseUrl}/auth/v1/forgot-password`,
      input,
      { withCredentials: true },
    );
  }

  resetPassword(input: {
    token: string;
    password: string;
  }): Observable<{ success: boolean }> {
    return this.http
      .post<{ success: boolean }>(
        `${this.config.authBaseUrl}/auth/v1/reset-password`,
        input,
        { withCredentials: true },
      )
      .pipe(tap(() => this.authState.clearSession()));
  }

  private withResolvedUser<T extends IAuthSessionModel>(
    session: T,
  ): Observable<T> {
    if (session.user?.id && session.user?.email) {
      return of(session);
    }

    if (!session.accessToken) {
      return of(session);
    }

    return this.http
      .get<IAuthUserModel>(`${this.config.authBaseUrl}/auth/v1/me`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
      .pipe(map((user) => ({ ...session, user })));
  }
}
