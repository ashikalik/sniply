import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAuthenticationIntegration } from '@sniply/authentication-angular';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAuthenticationIntegration({
      authBaseUrl: environment.api.authBaseUrl,
      apiBaseUrl: environment.api.sniplyServerBaseUrl,
      unauthorizedRedirectUrl: '/login',
    }),
  ],
};
