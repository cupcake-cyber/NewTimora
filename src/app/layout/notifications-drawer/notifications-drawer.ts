import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification/notification';

@Component({
  selector: 'app-notifications-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications-drawer.html',
})
export class NotificationsDrawerComponent {

  private service = inject(NotificationService);

  open = this.service.isOpen;

  notifications$ = this.service.getNotifications();

  close() {
    this.service.close();
  }
}