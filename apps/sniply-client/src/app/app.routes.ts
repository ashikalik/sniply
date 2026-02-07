import { Route } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { PricingPage } from './pages/pricing-page/pricing-page';
import { FeaturesPage } from './pages/features-page/features-page';
import { ResourcesPage } from './pages/resources-page/resources-page';

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
