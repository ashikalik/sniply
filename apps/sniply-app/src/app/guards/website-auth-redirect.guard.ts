import { CanActivateChildFn } from '@angular/router';
import { inject } from '@angular/core';
import {
  AuthStateService,
  IAuthUserModel,
} from '@sniply/authentication-angular';
import { environment } from '../../environments/environment';

const WEBSITE_LOGIN_URL = environment.apps.websiteLoginUrl;

export const websiteAuthRedirectGuard: CanActivateChildFn = (route) => {
  const authState = inject(AuthStateService);

  if (!authState.isAuthenticated && typeof window !== 'undefined') {
    const encodedAccessToken = route.queryParamMap.get('at');
    const encodedUser = route.queryParamMap.get('u');
    const encodedRefreshToken = route.queryParamMap.get('rt');

    const accessToken = decodeBase64(encodedAccessToken);
    const userJson = decodeBase64(encodedUser);
    const refreshToken = decodeBase64(encodedRefreshToken);

    if (accessToken && userJson) {
      try {
        const user = JSON.parse(userJson) as IAuthUserModel;
        if (user?.id && user?.email) {
          authState.setSession(accessToken, user, refreshToken || undefined);
          removeHandoffParamsFromUrl();
        }
      } catch {
        // Ignore invalid handoff payload and continue to redirect.
      }
    }
  }

  if (authState.isAuthenticated) {
    return true;
  }

  if (typeof window !== 'undefined') {
    window.location.assign(WEBSITE_LOGIN_URL);
    return false;
  }

  return true;
};

function decodeBase64(value: string | null): string {
  if (!value) {
    return '';
  }

  try {
    return atob(value);
  } catch {
    return '';
  }
}

function removeHandoffParamsFromUrl() {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.delete('at');
  currentUrl.searchParams.delete('u');
  currentUrl.searchParams.delete('rt');
  window.history.replaceState({}, '', currentUrl.toString());
}
