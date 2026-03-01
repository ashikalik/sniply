import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PopupConfirmationComponent } from '../../components/popup-confirmation/popup-confirmation';

interface IQrListItem {
  id: string;
  code: string;
  redirectUrl: string;
  qrImageUrl: string;
  targetUrl: string;
  label: string | null;
  foregroundColor: string | null;
  scans: number;
  createdAt: string | null;
  expiresAt: string | null;
}

interface IQrListResponse {
  items: IQrListItem[];
  pagination: {
    start: number;
    page: number;
    total: number;
  };
}

@Component({
  selector: 'app-qr-list-page',
  imports: [DatePipe, RouterModule, PopupConfirmationComponent],
  templateUrl: './qr-list-page.html',
  styleUrl: './qr-list-page.scss',
})
export class QrListPage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  protected qrCodes: IQrListItem[] = [];
  protected loading = false;
  protected errorMessage = '';
  protected start = 0;
  protected page = 10;
  protected total = 0;
  protected selectedCodes = new Set<string>();
  protected showDeleteConfirmation = false;
  protected deletingSelected = false;

  ngOnInit(): void {
    this.loadQrCodes();
  }

  protected loadQrCodes() {
    this.loading = true;
    this.errorMessage = '';

    this.http
      .get<IQrListResponse | string>(
        `${environment.api.baseUrl}${environment.endpoints.qrCodesList}`,
        {
          params: {
            start: String(this.start),
            page: String(this.page),
          },
        },
      )
      .subscribe({
        next: (response) => {
          const parsed = this.normalizeResponse(response);
          this.loading = false;
          this.qrCodes = parsed.items ?? [];
          const visibleCodes = new Set(this.qrCodes.map((item) => item.code));
          this.selectedCodes = new Set(
            Array.from(this.selectedCodes).filter((code) => visibleCodes.has(code)),
          );
          this.start = parsed.pagination?.start ?? this.start;
          this.page = parsed.pagination?.page ?? this.page;
          this.total = parsed.pagination?.total ?? 0;
          this.cdr.detectChanges();
        },
        error: (error: { error?: { message?: string } }) => {
          this.loading = false;
          this.errorMessage =
            error?.error?.message ?? 'Failed to load QR codes. Please try again.';
          this.cdr.markForCheck();
        },
      });
  }

  protected previousPage() {
    if (!this.canGoPrevious) {
      return;
    }
    this.start = Math.max(0, this.start - this.page);
    this.loadQrCodes();
  }

  protected nextPage() {
    if (!this.canGoNext) {
      return;
    }
    this.start += this.page;
    this.loadQrCodes();
  }

  protected get canGoPrevious() {
    return this.start > 0 && !this.loading;
  }

  protected get canGoNext() {
    return this.start + this.page < this.total && !this.loading;
  }

  protected getRedirectHref(code: string) {
    return `${environment.api.linkBaseUrl}/q/${encodeURIComponent(code)}`;
  }

  protected isChecked(code: string) {
    return this.selectedCodes.has(code);
  }

  protected toggleItem(code: string, checked: boolean) {
    if (checked) {
      this.selectedCodes.add(code);
    } else {
      this.selectedCodes.delete(code);
    }
  }

  protected toggleAll(checked: boolean) {
    if (checked) {
      this.qrCodes.forEach((item) => this.selectedCodes.add(item.code));
      return;
    }

    this.qrCodes.forEach((item) => this.selectedCodes.delete(item.code));
  }

  protected get selectedCount() {
    return this.selectedCodes.size;
  }

  protected get allSelected() {
    return (
      this.qrCodes.length > 0 &&
      this.qrCodes.every((item) => this.selectedCodes.has(item.code))
    );
  }

  protected promptDeleteSelected() {
    if (this.selectedCount === 0 || this.deletingSelected) {
      return;
    }
    this.showDeleteConfirmation = true;
  }

  protected cancelDeleteSelected() {
    if (this.deletingSelected) {
      return;
    }
    this.showDeleteConfirmation = false;
  }

  protected confirmDeleteSelected() {
    if (this.selectedCount === 0 || this.deletingSelected) {
      return;
    }

    this.deletingSelected = true;
    this.errorMessage = '';

    const codes = Array.from(this.selectedCodes).join(',');
    this.http
      .delete<{ ok: boolean; deleted: number; requested: number }>(
        `${environment.api.baseUrl}${environment.endpoints.qrCodesDelete}`,
        {
          params: { codes },
        },
      )
      .subscribe({
        next: () => {
          this.deletingSelected = false;
          this.showDeleteConfirmation = false;
          this.selectedCodes.clear();
          this.loadQrCodes();
        },
        error: (error: { error?: { message?: string } }) => {
          this.deletingSelected = false;
          this.errorMessage =
            error?.error?.message ?? 'Failed to delete selected QR codes.';
          this.cdr.markForCheck();
        },
      });
  }

  private normalizeResponse(response: IQrListResponse | string): IQrListResponse {
    if (typeof response === 'string') {
      try {
        return JSON.parse(response) as IQrListResponse;
      } catch {
        return {
          items: [],
          pagination: { start: this.start, page: this.page, total: 0 },
        };
      }
    }

    return response;
  }
}
