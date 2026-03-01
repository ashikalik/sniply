import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
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
  selector: 'app-register-page',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage implements AfterViewInit {
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
  @ViewChild('googleButtonContainer')
  private googleButtonContainer?: ElementRef<HTMLDivElement>;

  protected readonly registerForm = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      workEmail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      agree: [false, [Validators.requiredTrue]],
    },
    { validators: this.passwordsMatchValidator },
  );

  async ngAfterViewInit() {
    await this.initializeGoogleButton();
  }

  protected submit() {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { workEmail, password } = this.registerForm.getRawValue();
    this.isSubmitting = true;

    this.authApi.registerEmail({ email: workEmail, password }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        void this.router.navigate(['/register-success'], {
          queryParams: {
            email: workEmail,
            token: response.verifyEmailToken ?? null,
          },
        });
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message ??
          'Registration failed. Please check your details and try again.';
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
        text: 'signup_with',
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
        this.redirectToPendingDestination();
      },
      error: (error: { error?: { message?: string } }) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message ?? 'Google sign-in failed. Please try again.';
      },
    });
  }

  private redirectToPendingDestination() {
    const params = this.route.snapshot.queryParamMap;
    const appRoute = params.get('appRoute');
    if (appRoute !== 'link-form' && appRoute !== 'qr-form') {
      void this.router.navigate(['/']);
      return;
    }

    const redirectUrl = new URL(
      `${environment.apps.sniplyAppBaseUrl}/${appRoute}`,
    );

    const target = params.get('target')?.trim();
    const qr = params.get('qr')?.trim();

    if (target) {
      redirectUrl.searchParams.set('target', target);
    }

    if (qr) {
      redirectUrl.searchParams.set('qr', qr);
    }

    window.location.assign(redirectUrl.toString());
  }
}
