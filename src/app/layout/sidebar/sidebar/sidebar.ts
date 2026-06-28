import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth/auth';

import { SidebarHeaderComponent } from '../sidebar-header/sidebar-header';
import { SidebarUserComponent } from '../sidebar-user/sidebar-user';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu';
import { SidebarFooterComponent } from '../sidebar-footer/sidebar-footer';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarHeaderComponent,
    SidebarUserComponent,
    SidebarMenuComponent,
    SidebarFooterComponent
  ],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {

  private auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}