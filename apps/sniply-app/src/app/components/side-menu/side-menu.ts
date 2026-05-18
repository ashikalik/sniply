import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  imports: [RouterModule],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.scss',
})
export class SideMenuComponent {
  readonly links = [
    { path: '/app/home', label: 'Home', icon: 'bi-house-door' },
    { path: '/app/links', label: 'Links', icon: 'bi-link-45deg' },
    { path: '/app/qr-codes', label: 'QR Codes', icon: 'bi-qr-code-scan' },
    { path: '/app/pages', label: 'Pages', icon: 'bi-file-earmark-text' },
    { path: '/app/analytics', label: 'Analytics', icon: 'bi-bar-chart' },
    { path: '/app/campaigns', label: 'Campaigns', icon: 'bi-megaphone' },
    { path: '/app/custom-domains', label: 'Custom Domains', icon: 'bi-globe2' },
    { path: '/app/settings', label: 'Settings', icon: 'bi-gear' },
  ];
}
