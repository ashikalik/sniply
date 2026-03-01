import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthApiService } from '@sniply/authentication-angular';

@Component({
  selector: 'app-verify-email-page',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './verify-email-page.html',
  styleUrl: './verify-email-page.scss',
})
export class VerifyEmailPage {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly route = inject(ActivatedRoute);

  protected isSubmitting = false;
  protected errorMessage = '';
  protected successMessage = '';

  protected readonly verifyEmailForm = this.fb.nonNullable.group({
    token: [this.route.snapshot.queryParamMap.get('token')?.trim() ?? '', [Validators.required]],
  });

  protected submit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.verifyEmailForm.invalid) {
      this.verifyEmailForm.markAllAsTouched();
      return;
    }

    const { token } = this.verifyEmailForm.getRawValue();
    this.isSubmitting = true;

    this.authApi.verifyEmail({ token }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Email verified successfully. You can sign in now.';
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message ?? 'Unable to verify email. Please try again.';
      },
    });
  }
}
