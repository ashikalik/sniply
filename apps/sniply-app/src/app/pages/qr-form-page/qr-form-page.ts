import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { QrFormComponent } from '../../components/qr-form/qr-form';
import { environment } from '../../../environments/environment';

interface IQrPrefillPayload {
  targetUrl: string;
  label: string | null;
  foregroundColor: string | null;
}

@Component({
  selector: 'app-qr-form-page',
  imports: [QrFormComponent, AsyncPipe],
  templateUrl: './qr-form-page.html',
  styleUrl: './qr-form-page.scss',
})
export class QrFormPage {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  protected isSubmitting = false;
  protected errorMessage = '';

  protected readonly prefillQrPayload$ = this.route.queryParamMap.pipe(
    map((params) => this.decodeQrPayload(params.get('qr') ?? '', params.get('target') ?? '')),
  );

  private decodeBase64(encoded: string): string {
    if (!encoded) {
      return '';
    }

    try {
      return atob(encoded);
    } catch {
      return '';
    }
  }

  private decodeQrPayload(
    encodedPayload: string,
    encodedTarget: string,
  ): IQrPrefillPayload {
    if (encodedPayload) {
      try {
        const parsed = JSON.parse(this.decodeBase64(encodedPayload)) as Partial<IQrPrefillPayload>;
        return {
          targetUrl: parsed.targetUrl?.trim() ?? '',
          label: parsed.label?.trim() || null,
          foregroundColor: parsed.foregroundColor?.trim() || '#0f172a',
        };
      } catch {
        // fall through to legacy target-only handoff
      }
    }

    return {
      targetUrl: this.decodeBase64(encodedTarget),
      label: null,
      foregroundColor: '#0f172a',
    };
  }

  protected createQrCode(payload: {
    targetUrl: string;
    label: string | null;
    foregroundColor: string | null;
  }) {
    this.errorMessage = '';
    this.isSubmitting = true;

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
          this.isSubmitting = false;
          void this.router.navigate(['/qr-details', response.code]);
        },
        error: (error: { error?: { message?: string } }) => {
          this.isSubmitting = false;
          this.errorMessage =
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
