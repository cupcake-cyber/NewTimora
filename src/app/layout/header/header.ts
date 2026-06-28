import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

type UserRole = 'OWNER' | 'ADMIN' | 'USER';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
})
export class HeaderComponent {

  @Input() title: string = '';

  @Input() role: UserRole = 'USER';

  @Input() notificationCount: number = 0;

  @Output() notificationsToggle = new EventEmitter<void>();

  toggleNotifications() {
    this.notificationsToggle.emit();
  }

  getRoleLabel(): string {
    return this.role;
  }
}