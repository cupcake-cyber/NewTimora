import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth/auth';
import { MENU, MenuItem } from '../menu/menu';

import { SidebarItemComponent } from '../sidebar-item/sidebar-item';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, SidebarItemComponent],
  templateUrl: './sidebar-menu.html',
})
export class SidebarMenuComponent {

  private auth = inject(AuthService);

  menu: MenuItem[] = MENU;

  user = this.auth.getUser();

  get filteredMenu(): MenuItem[] {
    const role = this.user?.role;
    if (!role) return [];
    return this.menu.filter(item => item.roles.includes(role));
  }
}