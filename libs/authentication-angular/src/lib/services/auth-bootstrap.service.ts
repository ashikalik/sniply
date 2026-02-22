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
    return this.authApi.me().pipe(
      map(() => true),
      catchError(() =>
        this.authApi.refresh().pipe(
          switchMap(() => this.authApi.me()),
          map(() => true),
          catchError(() => {
            this.authState.clearSession();
            return of(false);
          }),
        ),
      ),
    );
  }
}
