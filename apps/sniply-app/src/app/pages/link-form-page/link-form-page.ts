import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LinkFormComponent } from '../../components/link-form/link-form';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-link-form-page',
  imports: [LinkFormComponent, AsyncPipe],
  templateUrl: './link-form-page.html',
  styleUrl: './link-form-page.scss',
})
export class LinkFormPage {
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
