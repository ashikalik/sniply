import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LinkFormComponent } from '../../components/link-form/link-form';
import { QrFormComponent } from '../../components/qr-form/qr-form';
import { environment } from '../../../environments/environment';

@Component({
  imports: [LinkFormComponent, QrFormComponent],
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  activeTab: 'links' | 'qr' = 'links';
  protected isSubmittingLink = false;
  protected isSubmittingQr = false;
  protected linkErrorMessage = '';
  protected qrErrorMessage = '';

  protected createLink(payload: {
    longUrl: string;
    expiresAt: string | null;
    maxClicks: number | null;
  }) {
    this.linkErrorMessage = '';
    this.isSubmittingLink = true;

    this.http
      .post<{ code: string }>(
        `${environment.api.baseUrl}${environment.endpoints.linksCreate}`,
        {
          longUrl: payload.longUrl,
          domain: this.getCurrentDomain(),
          expiresAt: payload.expiresAt,
          maxClicks: payload.maxClicks,
        },
      )
      .subscribe({
        next: (response) => {
          this.isSubmittingLink = false;
          void this.router.navigate(['/link-details', response.code]);
        },
        error: (error: { error?: { message?: string } }) => {
          this.isSubmittingLink = false;
          this.linkErrorMessage =
            error?.error?.message ?? 'Failed to create link. Please try again.';
        },
      });
  }

  protected createQrCode(payload: {
    targetUrl: string;
    label: string | null;
    foregroundColor: string | null;
  }) {
    this.qrErrorMessage = '';
    this.isSubmittingQr = true;

    this.http
      .post<{ code: string }>(
        `${environment.api.baseUrl}${environment.endpoints.qrCodesCreate}`,
        {
          targetUrl: payload.targetUrl,
          label: payload.label,
          foregroundColor: payload.foregroundColor,
          domain: this.getCurrentDomain(),
        },
      )
      .subscribe({
        next: (response) => {
          this.isSubmittingQr = false;
          void this.router.navigate(['/qr-details', response.code]);
        },
        error: (error: { error?: { message?: string } }) => {
          this.isSubmittingQr = false;
          this.qrErrorMessage =
            error?.error?.message ?? 'Failed to create QR code. Please try again.';
        },
      });
  }

  private getCurrentDomain() {
    if (typeof window === 'undefined') {
      return undefined;
    }

    return window.location.hostname;
  }
}
