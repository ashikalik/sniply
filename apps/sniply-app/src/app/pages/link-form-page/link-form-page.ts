import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkFormComponent } from '../../components/link-form/link-form';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-link-form-page',
  imports: [LinkFormComponent, AsyncPipe],
  templateUrl: './link-form-page.html',
  styleUrl: './link-form-page.scss',
})
export class LinkFormPage {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  protected isSubmitting = false;
  protected errorMessage = '';

  protected readonly prefillTargetUrl$ = this.route.queryParamMap.pipe(
    map((params) => params.get('target') ?? ''),
    map((encoded) => this.decodeBase64(encoded)),
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

  protected createLink(payload: {
    longUrl: string;
    expiresAt: string | null;
    maxClicks: number | null;
  }) {
    this.errorMessage = '';
    this.isSubmitting = true;

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
          this.isSubmitting = false;
          this.cdr.markForCheck();
          void this.router.navigate(['/link-details', response.code]);
        },
        error: (error: { error?: { message?: string } }) => {
          this.isSubmitting = false;
          this.errorMessage =
            error?.error?.message ?? 'Failed to create link. Please try again.';
          this.cdr.markForCheck();
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
