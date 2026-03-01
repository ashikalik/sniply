import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService, IAuthUserModel } from '@sniply/authentication-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home-page',
  imports: [ReactiveFormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private static readonly DEFAULT_QR_COLOR = '#0f172a';

  private readonly fb = inject(FormBuilder);
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  protected activeTab: 'links' | 'qr' = 'links';
  protected linkError = '';
  protected qrError = '';

  protected readonly linkForm = this.fb.nonNullable.group({
    destinationUrl: ['', [Validators.required]],
  });

  protected readonly qrForm = this.fb.nonNullable.group({
    destinationUrl: ['', [Validators.required]],
    label: [''],
    foregroundColor: [HomePage.DEFAULT_QR_COLOR],
  });

  protected submitLink() {
    this.linkError = '';
    if (this.linkForm.invalid) {
      this.linkForm.markAllAsTouched();
      return;
    }

    const destinationUrl = this.linkForm.controls.destinationUrl.value.trim();
    this.redirectToSniplyAppIfAuthenticated('link-form', destinationUrl, 'link');
  }

  protected submitQr() {
    this.qrError = '';
    if (this.qrForm.invalid) {
      this.qrForm.markAllAsTouched();
      return;
    }

    const payload = {
      targetUrl: this.qrForm.controls.destinationUrl.value.trim(),
      label: this.qrForm.controls.label.value.trim() || null,
      foregroundColor:
        this.qrForm.controls.foregroundColor.value.trim() ||
        HomePage.DEFAULT_QR_COLOR,
    };
    this.redirectToSniplyAppIfAuthenticated('qr-form', payload, 'qr');
  }

  private redirectToSniplyAppIfAuthenticated(
    route: 'link-form' | 'qr-form',
    payload: string | { targetUrl: string; label: string | null; foregroundColor: string },
    mode: 'link' | 'qr',
  ) {
    if (!this.authState.isAuthenticated) {
      if (mode === 'link') {
        this.linkError = 'Please sign in to continue creating links.';
      } else {
        this.qrError = 'Please sign in to continue creating QR codes.';
      }
      void this.router.navigate(['/login']);
      return;
    }

    const encodedAccessToken = this.toBase64(this.authState.accessToken ?? '');
    const encodedRefreshToken = this.toBase64(this.authState.refreshToken ?? '');
    const encodedUser = this.toBase64(
      JSON.stringify(this.authState.user as IAuthUserModel),
    );

    const targetPath = route === 'link-form'
      ? environment.endpoints.sniplyAppLinkForm
      : environment.endpoints.sniplyAppQrForm;
    const redirectUrl = new URL(
      `${environment.apps.sniplyAppBaseUrl}${targetPath}`,
    );
    if (mode === 'link' && typeof payload === 'string') {
      redirectUrl.searchParams.set('target', this.toBase64(payload));
    }
    if (mode === 'qr' && typeof payload !== 'string') {
      redirectUrl.searchParams.set('qr', this.toBase64(JSON.stringify(payload)));
    }
    redirectUrl.searchParams.set('at', encodedAccessToken);
    redirectUrl.searchParams.set('rt', encodedRefreshToken);
    redirectUrl.searchParams.set('u', encodedUser);

    window.location.assign(redirectUrl.toString());
  }

  private toBase64(input: string): string {
    return btoa(input);
  }
}
