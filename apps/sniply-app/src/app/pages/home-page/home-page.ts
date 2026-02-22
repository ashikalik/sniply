import { Component } from '@angular/core';
import { LinkFormComponent } from '../../components/link-form/link-form';
import { QrFormComponent } from '../../components/qr-form/qr-form';

@Component({
  imports: [LinkFormComponent, QrFormComponent],
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  activeTab: 'links' | 'qr' = 'links';
}
