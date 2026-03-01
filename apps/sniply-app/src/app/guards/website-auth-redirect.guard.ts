import { CanActivateChildFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '@sniply/authentication-angular';
import { environment } from '../../environments/environment';

const WEBSITE_LOGIN_URL = environment.apps.websiteLoginUrl;

export const websiteAuthRedirectGuard: CanActivateChildFn = () => {
  const authState = inject(AuthStateService);

  if (authState.isAuthenticated) {
    return true;
  }

  if (typeof window !== 'undefined') {
    window.location.assign(WEBSITE_LOGIN_URL);
    return false;
  }

  return true;
};
