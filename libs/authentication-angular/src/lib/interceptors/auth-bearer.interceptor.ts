import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AUTH_CLIENT_CONFIG } from '../config/auth-client.config';
import { AuthRefreshService } from '../services/auth-refresh.service';
import { AuthStateService } from '../services/auth-state.service';

const RETRY_HEADER = 'x-auth-refresh-retry';

function withAccessToken(req: HttpRequest<unknown>, token: string | null) {
  if (!token) {
    return req;
  }

  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const authBearerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const config = inject(AUTH_CLIENT_CONFIG);
  const authState = inject(AuthStateService);
  const refreshService = inject(AuthRefreshService);

  const isAuthEndpoint = req.url.startsWith(config.authBaseUrl);
  const isRetry = req.headers.has(RETRY_HEADER);

  const request = !isAuthEndpoint
    ? withAccessToken(req, authState.accessToken)
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        isAuthEndpoint ||
        isRetry ||
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401
      ) {
        return throwError(() => error);
      }

      return refreshService.refreshOnce().pipe(
        switchMap((ok) => {
          if (!ok) {
            return throwError(() => error);
          }

          const retriedRequest = withAccessToken(req, authState.accessToken).clone({
            setHeaders: {
              [RETRY_HEADER]: '1',
            },
          });

          return next(retriedRequest);
        }),
      );
    }),
  );
};
