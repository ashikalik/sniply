import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthApiService,
  AuthStateService,
} from '@sniply/authentication-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly authState = inject(AuthStateService);
  private readonly authApi = inject(AuthApiService);
  protected readonly user$ = this.authState.user$;
  protected isLoggingOut = false;

  protected getInitial(email: string): string {
    return (email?.trim().charAt(0) ?? 'U').toUpperCase();
  }

  protected getShortId(id?: string): string {
    if (!id) {
      return '-';
    }

    return id.slice(0, 8);
  }

  protected logout() {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    this.authApi.logout().subscribe({
      next: () => {
        this.isLoggingOut = false;
        this.authState.clearSession();
        window.location.assign(environment.apps.websiteLoginUrl);
      },
      error: () => {
        this.isLoggingOut = false;
      },
    });
  }
}
