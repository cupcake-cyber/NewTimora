import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SidebarComponent } from '../../layout/sidebar/sidebar/sidebar';
import { HeaderComponent } from '../../layout/header/header';
import { NotificationsDrawerComponent } from '../../layout/notifications-drawer/notifications-drawer';

import { PAGE_TITLES } from '../../config/page-titles';

@Component({
  selector: 'app-app',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    NotificationsDrawerComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {

  private router = inject(Router);

  isNotificationsOpen = false;

  title = 'Dashboard';

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.title = PAGE_TITLES[event.urlAfterRedirects] ?? 'App';
      });
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  closeNotifications() {
    this.isNotificationsOpen = false;
  }
}