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
        catchError(() => {
          this.authState.clearSession();
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
}
