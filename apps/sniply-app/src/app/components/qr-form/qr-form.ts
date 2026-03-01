import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
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
  @Input() prefillLabel = '';
  @Input() prefillForegroundColor = '';
  @Input() isSubmitting = false;
  @Output() formSubmit = new EventEmitter<{
    targetUrl: string;
    label: string | null;
    foregroundColor: string | null;
  }>();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    destinationUrl: ['', [Validators.required]],
    label: [''],
    color: ['#0f172a'],
  });

  ngOnChanges(changes: SimpleChanges): void {
    const nextUrl = changes['prefillTargetUrl']?.currentValue as string | undefined;
    const nextLabel = changes['prefillLabel']?.currentValue as string | undefined;
    const nextColor = changes['prefillForegroundColor']?.currentValue as string | undefined;

    this.form.patchValue({
      destinationUrl: nextUrl || this.form.controls.destinationUrl.value,
      label: nextLabel ?? this.form.controls.label.value,
      color: nextColor || this.form.controls.color.value,
    });
  }

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { destinationUrl, label, color } = this.form.getRawValue();
    this.formSubmit.emit({
      targetUrl: destinationUrl.trim(),
      label: label.trim() || null,
      foregroundColor: color.trim() || null,
    });
  }
}
