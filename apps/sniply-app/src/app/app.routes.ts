import { Route } from '@angular/router';
import { AnalyticsPage } from './pages/analytics-page/analytics-page';
import { CampaignsPage } from './pages/campaigns-page/campaigns-page';
import { CustomDomainsPage } from './pages/custom-domains-page/custom-domains-page';
import { ForgotPasswordPage } from './pages/forgot-password-page/forgot-password-page';
import { HomePage } from './pages/home-page/home-page';
import { LinkFormPage } from './pages/link-form-page/link-form-page';
import { LinkDetailsPage } from './pages/link-details-page/link-details-page';
import { LinkListPage } from './pages/link-list-page/link-list-page';
import { LoginPage } from './pages/login-page/login-page';
import { PagesListPage } from './pages/pages-list-page/pages-list-page';
import { PrivacyPolicyPage } from './pages/privacy-policy-page/privacy-policy-page';
import { QrFormPage } from './pages/qr-form-page/qr-form-page';
import { QrListPage } from './pages/qr-list-page/qr-list-page';
import { SettingsPage } from './pages/settings-page/settings-page';
import { TermsPage } from './pages/terms-page/terms-page';
import { websiteAuthRedirectGuard } from './guards/website-auth-redirect.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    canActivateChild: [websiteAuthRedirectGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', component: HomePage },
      { path: 'login', component: LoginPage },
      { path: 'forgot-password', component: ForgotPasswordPage },
      { path: 'terms', component: TermsPage },
      { path: 'privacy-policy', component: PrivacyPolicyPage },
      { path: 'links', component: LinkListPage },
      { path: 'link-form', component: LinkFormPage },
      { path: 'link-details/:code', component: LinkDetailsPage },
      { path: 'qr-codes', component: QrListPage },
      { path: 'qr-form', component: QrFormPage },
      { path: 'pages', component: PagesListPage },
      { path: 'analytics', component: AnalyticsPage },
      { path: 'campaigns', component: CampaignsPage },
      { path: 'custom-domains', component: CustomDomainsPage },
      { path: 'settings', component: SettingsPage },
      { path: '**', redirectTo: 'home' },
    ],
  },
];
