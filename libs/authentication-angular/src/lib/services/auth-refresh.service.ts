import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import { AuthStateService } from './auth-state.service';

@Injectable({ providedIn: 'root' })
export class AuthRefreshService {
  private refreshInFlight$?: Observable<boolean>;

  constructor(
    private readonly authApi: AuthApiService,
    private readonly authState: AuthStateService,
  ) {}

  refreshOnce(): Observable<boolean> {
    if (!this.refreshInFlight$) {
      this.refreshInFlight$ = this.authApi.refresh().pipe(
        map(() => true),
        catchError((error: { status?: number }) => {
          if (this.isUnauthorized(error)) {
            this.authState.clearSession();
          }
          return of(false);
        }),
        tap(() => {
          this.refreshInFlight$ = undefined;
        }),
        shareReplay(1),
      );
    }

    return this.refreshInFlight$;
  }

  private isUnauthorized(error: { status?: number } | null | undefined): boolean {
    return error?.status === 401 || error?.status === 403;
  }
}
