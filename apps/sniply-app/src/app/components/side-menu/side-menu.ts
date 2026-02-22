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
    { path: '/home', label: 'Home', icon: 'bi-house-door' },
    { path: '/links', label: 'Links', icon: 'bi-link-45deg' },
    { path: '/qr-codes', label: 'QR Codes', icon: 'bi-qr-code-scan' },
    { path: '/pages', label: 'Pages', icon: 'bi-file-earmark-text' },
    { path: '/analytics', label: 'Analytics', icon: 'bi-bar-chart' },
    { path: '/campaigns', label: 'Campaigns', icon: 'bi-megaphone' },
    { path: '/custom-domains', label: 'Custom Domains', icon: 'bi-globe2' },
    { path: '/settings', label: 'Settings', icon: 'bi-gear' },
  ];
}
