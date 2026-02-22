import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { QrFormComponent } from '../../components/qr-form/qr-form';

@Component({
  selector: 'app-qr-form-page',
  imports: [QrFormComponent, AsyncPipe],
  templateUrl: './qr-form-page.html',
  styleUrl: './qr-form-page.scss',
})
export class QrFormPage {
  private readonly route = inject(ActivatedRoute);

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
}
