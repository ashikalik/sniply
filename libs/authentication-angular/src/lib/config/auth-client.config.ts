import { InjectionToken } from '@angular/core';

export interface IAuthClientConfig {
  authBaseUrl: string;
  apiBaseUrl?: string;
  unauthorizedRedirectUrl?: string;
}

export const AUTH_CLIENT_CONFIG = new InjectionToken<IAuthClientConfig>(
  'AUTH_CLIENT_CONFIG',
);
