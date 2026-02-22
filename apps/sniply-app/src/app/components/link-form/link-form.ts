import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-link-form',
  imports: [ReactiveFormsModule],
  templateUrl: './link-form.html',
  styleUrl: './link-form.scss',
})
export class LinkFormComponent implements OnChanges {
  @Input() prefillTargetUrl = '';

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    destinationUrl: ['', [Validators.required]],
    slug: [''],
    campaign: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    const nextUrl = changes['prefillTargetUrl']?.currentValue as string | undefined;
    if (nextUrl) {
      this.form.patchValue({ destinationUrl: nextUrl });
    }
  }

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
