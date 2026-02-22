import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

interface IAnalyticsClick {
  id?: string;
  clicked_at?: string;
  country?: string | null;
  device_type?: string | null;
  referrer?: string;
}

interface IAnalyticsResponse {
  code: string;
  from: string | null;
  to: string | null;
  total: number;
  clicks: IAnalyticsClick[];
}

@Component({
  selector: 'app-analytics-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './analytics-page.html',
  styleUrl: './analytics-page.scss',
})
export class AnalyticsPage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  protected loading = false;
  protected errorMessage = '';
  protected data: IAnalyticsResponse | null = null;

  protected readonly analyticsForm = this.fb.nonNullable.group({
    code: ['CW340I', [Validators.required]],
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const code = params.get('code')?.trim();
      if (code) {
        this.analyticsForm.patchValue({ code });
      }
      this.loadAnalytics();
    });
  }

  protected loadAnalytics() {
    this.errorMessage = '';
    if (this.analyticsForm.invalid) {
      this.analyticsForm.markAllAsTouched();
      return;
    }

    const code = this.analyticsForm.controls.code.value.trim();
    if (!code) {
      return;
    }

    this.loading = true;
    const { fromIso, toIso } = this.getLast24HoursRange();

    this.http
      .get<IAnalyticsResponse | string>(
        `${environment.api.baseUrl}${environment.endpoints.linksAnalyticsPrefix}/${encodeURIComponent(code)}/analytics`,
        {
          params: {
            from: fromIso,
            to: toIso,
          },
        },
      )
      .subscribe({
        next: (response) => {
          const normalized = this.normalizeResponse(response);
          this.loading = false;
          this.data = normalized;
          this.cdr.markForCheck();
        },
        error: (error: { error?: { message?: string } }) => {
          this.loading = false;
          this.data = null;
          this.errorMessage =
            error?.error?.message ?? 'Failed to load analytics data.';
          this.cdr.markForCheck();
        },
      });
  }

  private getLast24HoursRange() {
    const to = new Date();
    const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
    return {
      fromIso: from.toISOString(),
      toIso: to.toISOString(),
    };
  }

  private normalizeResponse(response: IAnalyticsResponse | string): IAnalyticsResponse {
    const fallback: IAnalyticsResponse = {
      code: this.analyticsForm.controls.code.value,
      from: null,
      to: null,
      total: 0,
      clicks: [],
    };

    const parsed = (() => {
      if (typeof response !== 'string') {
        return response;
      }

      try {
        return JSON.parse(response) as IAnalyticsResponse;
      } catch {
        return fallback;
      }
    })();

    return {
      code: parsed.code ?? fallback.code,
      from: parsed.from ?? null,
      to: parsed.to ?? null,
      total: Number(parsed.total ?? 0),
      clicks: Array.isArray(parsed.clicks) ? parsed.clicks : [],
    };
  }
}
