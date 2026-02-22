import {
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  AUTH_CLIENT_CONFIG,
  IAuthClientConfig,
} from '../config/auth-client.config';
import { authBearerInterceptor } from '../interceptors/auth-bearer.interceptor';
import { provideAuthInitializer } from './auth-initializer.provider';

export function provideAuthenticationIntegration(
  config: IAuthClientConfig,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: AUTH_CLIENT_CONFIG,
      useValue: config,
    },
    provideHttpClient(withFetch(), withInterceptors([authBearerInterceptor])),
    provideAuthInitializer(),
  ]);
}
