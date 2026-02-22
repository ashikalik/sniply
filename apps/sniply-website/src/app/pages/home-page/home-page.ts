import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStateService } from '@sniply/authentication-angular';

@Component({
  selector: 'app-home-page',
  imports: [ReactiveFormsModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
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

    const destinationUrl = this.qrForm.controls.destinationUrl.value.trim();
    this.redirectToSniplyAppIfAuthenticated('qr-form', destinationUrl, 'qr');
  }

  private redirectToSniplyAppIfAuthenticated(
    route: 'link-form' | 'qr-form',
    url: string,
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

    const encodedUrl = btoa(url);
    window.location.assign(`http://localhost:4201/${route}?target=${encodedUrl}`);
  }
}
