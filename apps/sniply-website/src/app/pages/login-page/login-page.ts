import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthApiService } from '@sniply/authentication-angular';
import {
  getGoogleIdentityApi,
  IGoogleCredentialResponse,
  loadGoogleIdentityScript,
} from '../../common/google-identity';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-page',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage implements AfterViewInit {
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
  @ViewChild('googleButtonContainer')
  private googleButtonContainer?: ElementRef<HTMLDivElement>;

  async ngAfterViewInit() {
    await this.initializeGoogleButton();
  }

  protected submit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.isSubmitting = true;

    this.authApi.loginEmail({ email, password }).subscribe({
      next: () => {
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

  private async initializeGoogleButton() {
    if (!environment.apps.googleClientId || !this.googleButtonContainer) {
      return;
    }

    try {
      await loadGoogleIdentityScript();
      const google = getGoogleIdentityApi();
      if (!google) {
        return;
      }

      google.accounts.id.initialize({
        client_id: environment.apps.googleClientId,
        callback: (response: IGoogleCredentialResponse) =>
          this.loginWithGoogleCredential(response.credential),
      });

      google.accounts.id.renderButton(this.googleButtonContainer.nativeElement, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 360,
      });
    } catch {
      this.errorMessage = 'Unable to initialize Google sign-in.';
    }
  }

  private loginWithGoogleCredential(idToken?: string) {
    if (!idToken) {
      this.errorMessage = 'Google sign-in did not return a valid token.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authApi.loginGoogle({ idToken }).subscribe({
      next: () => {
        this.isSubmitting = false;
        void this.router.navigate(['/']);
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message ?? 'Google sign-in failed. Please try again.';
      },
    });
  }
}
