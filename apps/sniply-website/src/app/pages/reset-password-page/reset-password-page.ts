import { Component, inject } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthApiService } from '@sniply/authentication-angular';

@Component({
  selector: 'app-reset-password-page',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.scss',
})
export class ResetPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly passwordsMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  protected isSubmitting = false;
  protected errorMessage = '';
  protected successMessage = '';

  protected readonly resetPasswordForm = this.fb.nonNullable.group(
    {
      token: [this.route.snapshot.queryParamMap.get('token')?.trim() ?? '', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator },
  );

  protected submit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const { token, password } = this.resetPasswordForm.getRawValue();
    this.isSubmitting = true;

    this.authApi.resetPassword({ token, password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Password updated successfully. You can sign in now.';
        this.resetPasswordForm.patchValue({
          password: '',
          confirmPassword: '',
        });
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message ?? 'Unable to reset password. Please try again.';
      },
    });
  }

  protected goToLogin() {
    void this.router.navigate(['/login']);
  }
}
