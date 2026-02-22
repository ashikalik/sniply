import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AUTH_CLIENT_CONFIG } from '../config/auth-client.config';
import { AuthStateService } from '../services/auth-state.service';

export const authenticatedGuard: CanActivateFn = () => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const config = inject(AUTH_CLIENT_CONFIG);

  if (authState.isAuthenticated) {
    return true;
  }

  const redirectUrl = config.unauthorizedRedirectUrl;
  if (!redirectUrl) {
    return false;
  }

  return router.parseUrl(redirectUrl);
};
