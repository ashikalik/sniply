import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAuthUserModel } from '../models/auth-user.model';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private static readonly ACCESS_TOKEN_KEY = 'sniply.auth.accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'sniply.auth.refreshToken';
  private static readonly USER_KEY = 'sniply.auth.user';

  private readonly accessTokenSubject = new BehaviorSubject<string | null>(null);
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private readonly userSubject = new BehaviorSubject<IAuthUserModel | null>(null);
  private readonly initializedSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.hydrateFromStorage();
  }

  readonly accessToken$ = this.accessTokenSubject.asObservable();
  readonly refreshToken$ = this.refreshTokenSubject.asObservable();
  readonly user$ = this.userSubject.asObservable();
  readonly initialized$ = this.initializedSubject.asObservable();

  get accessToken() {
    return this.accessTokenSubject.value;
  }

  get user() {
    return this.userSubject.value;
  }

  get refreshToken() {
    return this.refreshTokenSubject.value;
  }

  get isAuthenticated() {
    return !!this.accessTokenSubject.value && !!this.userSubject.value;
  }

  setSession(accessToken: string, user: IAuthUserModel, refreshToken?: string) {
    this.accessTokenSubject.next(accessToken);
    this.refreshTokenSubject.next(refreshToken ?? null);
    this.userSubject.next(user);
    this.persistToStorage(accessToken, user, refreshToken ?? null);
  }

  setAccessToken(accessToken: string) {
    this.accessTokenSubject.next(accessToken);
    this.persistToStorage(
      accessToken,
      this.userSubject.value,
      this.refreshTokenSubject.value,
    );
  }

  setUser(user: IAuthUserModel | null) {
    this.userSubject.next(user);
    this.persistToStorage(
      this.accessTokenSubject.value,
      user,
      this.refreshTokenSubject.value,
    );
  }

  clearSession() {
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
    this.userSubject.next(null);
    this.clearStorage();
  }

  markInitialized() {
    this.initializedSubject.next(true);
  }

  private hydrateFromStorage() {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    try {
      const accessToken = storage.getItem(AuthStateService.ACCESS_TOKEN_KEY);
      const refreshToken = storage.getItem(AuthStateService.REFRESH_TOKEN_KEY);
      const userRaw = storage.getItem(AuthStateService.USER_KEY);
      const user = userRaw ? (JSON.parse(userRaw) as IAuthUserModel) : null;

      if (accessToken && user) {
        this.accessTokenSubject.next(accessToken);
        this.userSubject.next(user);
      }

      if (refreshToken) {
        this.refreshTokenSubject.next(refreshToken);
      }
    } catch {
      this.clearStorage();
    }
  }

  private persistToStorage(
    accessToken: string | null,
    user: IAuthUserModel | null,
    refreshToken: string | null,
  ) {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    if (accessToken && user) {
      storage.setItem(AuthStateService.ACCESS_TOKEN_KEY, accessToken);
      storage.setItem(AuthStateService.USER_KEY, JSON.stringify(user));
    } else {
      storage.removeItem(AuthStateService.ACCESS_TOKEN_KEY);
      storage.removeItem(AuthStateService.USER_KEY);
    }

    if (refreshToken) {
      storage.setItem(AuthStateService.REFRESH_TOKEN_KEY, refreshToken);
    } else {
      storage.removeItem(AuthStateService.REFRESH_TOKEN_KEY);
    }
  }

  private clearStorage() {
    const storage = this.getStorage();
    if (!storage) {
      return;
    }

    storage.removeItem(AuthStateService.ACCESS_TOKEN_KEY);
    storage.removeItem(AuthStateService.REFRESH_TOKEN_KEY);
    storage.removeItem(AuthStateService.USER_KEY);
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage;
  }
}
