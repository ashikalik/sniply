import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthApiService } from '@sniply/authentication-angular';

@Component({
  selector: 'app-login-page',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  protected isSubmitting = false;
  protected errorMessage = '';

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember: [false],
  });

  protected submit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.isSubmitting = true;

    this.authApi.loginEmail({ email, password }).subscribe({
        next: (session) => {
          this.isSubmitting = false;
          void this.router.navigate(['/']);
        },
        error: (error: { error?: { message?: string } }) => {
          this.isSubmitting = false;
          this.errorMessage =
            error?.error?.message ??
            'Login failed. Please check your credentials and try again.';
        },
      });
  }
}
