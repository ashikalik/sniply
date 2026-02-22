import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStateService } from '@sniply/authentication-angular';

@Component({
  selector: 'app-header',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  private readonly authState = inject(AuthStateService);
  protected readonly user$ = this.authState.user$;

  protected getInitial(email: string): string {
    return (email?.trim().charAt(0) ?? 'U').toUpperCase();
  }
}
