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
    { path: '/', label: 'Home' },
    { path: '/links', label: 'Link List' },
    { path: '/link-form', label: 'Link Form' },
    { path: '/qr-codes', label: 'QR List' },
    { path: '/qr-form', label: 'QR Form' },
    { path: '/pages', label: 'Pages List' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/campaigns', label: 'Campaigns' },
    { path: '/custom-domains', label: 'Custom Domains' },
    { path: '/settings', label: 'Settings' },
  ];
}
