import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
})
export class HeaderComponent {

  @Input() title: string = '';

  @Input() userName: string = 'User';

  @Input() notificationCount: number = 0;

  @Output() notificationsToggle = new EventEmitter<void>();

  toggleNotifications() {
    this.notificationsToggle.emit();
  }

  get initial(): string {
    return this.userName?.charAt(0)?.toUpperCase() ?? 'U';
  }
}