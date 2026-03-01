import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface IQrCodeDetails {
  id: string;
  code: string;
  redirectUrl: string;
  qrImageUrl: string;
  targetUrl: string;
  label: string | null;
  foregroundColor: string | null;
  expiresAt: string | null;
  createdAt: string | null;
}

@Component({
  selector: 'app-qr-details-page',
  imports: [AsyncPipe, DatePipe, RouterModule],
  templateUrl: './qr-details-page.html',
  styleUrl: './qr-details-page.scss',
})
export class QrDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  protected readonly details$ = this.route.paramMap.pipe(
    map((params) => params.get('code') ?? ''),
    switchMap((code) =>
      this.http
        .get<IQrCodeDetails>(
          `${environment.api.baseUrl}${environment.endpoints.qrCodesRead}/${encodeURIComponent(code)}`,
        )
        .pipe(catchError(() => of(null))),
    ),
  );

  protected getRedirectHref(code: string) {
    return `${environment.api.linkBaseUrl}/q/${encodeURIComponent(code)}`;
  }
}
