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

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideAuthenticationIntegration({
      authBaseUrl: 'http://localhost:3000',
      apiBaseUrl: 'http://localhost:3001',
      unauthorizedRedirectUrl: '/login',
    }),
  ],
};
