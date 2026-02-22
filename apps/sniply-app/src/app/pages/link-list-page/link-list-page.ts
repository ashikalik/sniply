import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { PopupConfirmationComponent } from '../../components/popup-confirmation/popup-confirmation';

interface ILinkListItem {
  id: string;
  code: string;
  shortUrl: string;
  longUrl: string;
  createdAt: string | null;
  expiresAt: string | null;
}

interface ILinkListResponse {
  items: ILinkListItem[];
  pagination: {
    start: number;
    page: number;
    total: number;
  };
}

@Component({
  selector: 'app-link-list-page',
  imports: [DatePipe, RouterModule, PopupConfirmationComponent],
  templateUrl: './link-list-page.html',
  styleUrl: './link-list-page.scss',
})
export class LinkListPage implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  protected links: ILinkListItem[] = [];
  protected loading = false;
  protected errorMessage = '';
  protected start = 0;
  protected page = 10;
  protected total = 0;
  protected selectedCodes = new Set<string>();
  protected showDeleteConfirmation = false;
  protected deletingSelected = false;

  ngOnInit(): void {
    this.loadLinks();
  }

  protected loadLinks() {
    this.loading = true;
    this.errorMessage = '';

    this.http
      .get<ILinkListResponse | string>(
        `${environment.api.baseUrl}${environment.endpoints.linksList}`,
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
          this.links = parsed.items ?? [];
          const visibleCodes = new Set(this.links.map((link) => link.code));
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
            error?.error?.message ?? 'Failed to load links. Please try again.';
          this.cdr.markForCheck();
        },
      });
  }

  protected previousPage() {
    if (!this.canGoPrevious) {
      return;
    }
    this.start = Math.max(0, this.start - this.page);
    this.loadLinks();
  }

  protected nextPage() {
    if (!this.canGoNext) {
      return;
    }
    this.start += this.page;
    this.loadLinks();
  }

  protected get canGoPrevious() {
    return this.start > 0 && !this.loading;
  }

  protected get canGoNext() {
    return this.start + this.page < this.total && !this.loading;
  }

  protected openShortLink(code: string, event: Event) {
    event.preventDefault();
    const navigateUrl = this.getShortNavigateHref(code);
    window.location.assign(navigateUrl);
  }

  protected getShortNavigateHref(code: string) {
    return `${environment.api.linkBaseUrl}/r/${encodeURIComponent(code)}`;
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
      this.links.forEach((link) => this.selectedCodes.add(link.code));
      return;
    }

    this.links.forEach((link) => this.selectedCodes.delete(link.code));
  }

  protected get selectedCount() {
    return this.selectedCodes.size;
  }

  protected get allSelected() {
    return this.links.length > 0 && this.links.every((link) => this.selectedCodes.has(link.code));
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
        `${environment.api.baseUrl}${environment.endpoints.linksDelete}`,
        {
          params: { codes },
        },
      )
      .subscribe({
        next: () => {
          this.deletingSelected = false;
          this.showDeleteConfirmation = false;
          this.selectedCodes.clear();
          this.loadLinks();
        },
        error: (error: { error?: { message?: string } }) => {
          this.deletingSelected = false;
          this.errorMessage =
            error?.error?.message ?? 'Failed to delete selected links.';
          this.cdr.markForCheck();
        },
      });
  }

  private normalizeResponse(response: ILinkListResponse | string): ILinkListResponse {
    if (typeof response === 'string') {
      try {
        return JSON.parse(response) as ILinkListResponse;
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
