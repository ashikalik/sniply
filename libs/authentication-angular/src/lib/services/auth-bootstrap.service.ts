import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AuthStateService } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthBootstrapService {
  constructor(
    private readonly authApi: AuthApiService,
    private readonly authState: AuthStateService,
  ) {}

  initialize(): Observable<boolean> {
    this.authState.restoreFromStorage();

    // Resolve identity from auth service session first to avoid stale user state
    // when moving between apps running on different origins.
    return this.authApi.refresh().pipe(
      switchMap(() => this.authApi.me()),
      map(() => true),
      catchError((error: { status?: number }) => {
        if (this.isUnauthorized(error)) {
          this.authState.clearSession();
          return of(false);
        }

        return of(this.authState.isAuthenticated);
      }),
    );
  }

  private isUnauthorized(error: { status?: number } | null | undefined): boolean {
    return error?.status === 401 || error?.status === 403;
  }
}
