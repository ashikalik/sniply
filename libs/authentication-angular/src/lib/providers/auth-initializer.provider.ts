import { APP_INITIALIZER, Provider } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthBootstrapService } from '../services/auth-bootstrap.service';
import { AuthStateService } from '../services/auth-state.service';

function initAuthFactory(
  bootstrap: AuthBootstrapService,
  authState: AuthStateService,
) {
  return async () => {
    try {
      await firstValueFrom(bootstrap.initialize());
    } finally {
      authState.markInitialized();
    }
  };
}

export function provideAuthInitializer(): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: initAuthFactory,
    deps: [AuthBootstrapService, AuthStateService],
    multi: true,
  };
}
