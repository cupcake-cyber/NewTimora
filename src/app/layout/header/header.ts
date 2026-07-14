import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification/notification';

type UserRole = 'OWNER' | 'ADMIN' | 'USER';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
})
export class HeaderComponent {

  private notificationsService = inject(NotificationService);

  @Input() title: string = '';
  @Input() role?: UserRole;

  @Output() notificationsToggle = new EventEmitter<void>();

  toggleNotifications() {
    this.notificationsToggle.emit();
  }

  hasNotifications = this.notificationsService.hasNewNotifications;

  unreadCount = this.notificationsService.unreadCount;
}