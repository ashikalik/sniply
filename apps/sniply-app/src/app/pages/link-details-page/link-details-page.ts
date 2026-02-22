import { AsyncPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

interface ILinkDetails {
  id: string;
  code: string;
  shortUrl: string;
  longUrl: string;
  expiresAt: string | null;
  createdAt: string | null;
}

@Component({
  selector: 'app-link-details-page',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './link-details-page.html',
  styleUrl: './link-details-page.scss',
})
export class LinkDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  protected readonly details$ = this.route.paramMap.pipe(
    map((params) => params.get('code') ?? ''),
    switchMap((code) =>
      this.http
        .get<ILinkDetails>(
          `${environment.api.baseUrl}${environment.endpoints.linksRead}/${encodeURIComponent(code)}`,
        )
        .pipe(catchError(() => of(null))),
    ),
  );

  protected openShortLink(code: string, event: Event) {
    event.preventDefault();
    const navigateUrl = this.getShortNavigateHref(code);
    window.location.assign(navigateUrl);
  }

  protected getShortNavigateHref(code: string) {
    return `${environment.api.linkBaseUrl}/r/${encodeURIComponent(code)}`;
  }
}
