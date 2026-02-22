import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer';
import { HeaderComponent } from './components/header/header';
import { SideMenuComponent } from './components/side-menu/side-menu';

@Component({
  imports: [RouterModule, HeaderComponent, SideMenuComponent, FooterComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'sniply-app';
}
