import { Route } from '@angular/router';
import { AnalyticsPage } from './pages/analytics-page/analytics-page';
import { CampaignsPage } from './pages/campaigns-page/campaigns-page';
import { CustomDomainsPage } from './pages/custom-domains-page/custom-domains-page';
import { HomePage } from './pages/home-page/home-page';
import { LinkFormPage } from './pages/link-form-page/link-form-page';
import { LinkListPage } from './pages/link-list-page/link-list-page';
import { PagesListPage } from './pages/pages-list-page/pages-list-page';
import { QrFormPage } from './pages/qr-form-page/qr-form-page';
import { QrListPage } from './pages/qr-list-page/qr-list-page';
import { SettingsPage } from './pages/settings-page/settings-page';

export const appRoutes: Route[] = [
  { path: '', component: HomePage },
  { path: 'links', component: LinkListPage },
  { path: 'link-form', component: LinkFormPage },
  { path: 'qr-codes', component: QrListPage },
  { path: 'qr-form', component: QrFormPage },
  { path: 'pages', component: PagesListPage },
  { path: 'analytics', component: AnalyticsPage },
  { path: 'campaigns', component: CampaignsPage },
  { path: 'custom-domains', component: CustomDomainsPage },
  { path: 'settings', component: SettingsPage },
  { path: '**', redirectTo: '' },
];
