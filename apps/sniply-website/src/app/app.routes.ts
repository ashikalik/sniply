import { Route } from '@angular/router';
import { FeaturesPage } from './pages/features-page/features-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { PricingPage } from './pages/pricing-page/pricing-page';
import { PrivacyPolicyPage } from './pages/privacy-policy-page/privacy-policy-page';
import { RegisterPage } from './pages/register-page/register-page';
import { RegisterSuccessPage } from './pages/register-success-page/register-success-page';
import { ResourcesPage } from './pages/resources-page/resources-page';
import { TermsPage } from './pages/terms-page/terms-page';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'register',
    component: RegisterPage,
  },
  {
    path: 'register-success',
    component: RegisterSuccessPage,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPage,
  },
  {
    path: 'terms',
    component: TermsPage,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyPage,
  },
  {
    path: 'pricing',
    component: PricingPage,
  },
  {
    path: 'features',
    component: FeaturesPage,
  },
  {
    path: 'resources',
    component: ResourcesPage,
  },
];
