import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-qr-form',
  imports: [ReactiveFormsModule],
  templateUrl: './qr-form.html',
  styleUrl: './qr-form.scss',
})
export class QrFormComponent implements OnChanges {
  @Input() prefillTargetUrl = '';

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    destinationUrl: ['', [Validators.required]],
    label: [''],
    color: ['#0f172a'],
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
