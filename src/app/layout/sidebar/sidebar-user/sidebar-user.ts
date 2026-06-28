import { ChangeDetectorRef,Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SessionService, UserSession } from '../../../services/user-session/user-session';

@Component({
  selector: 'app-sidebar-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-user.html',
})
export class SidebarUserComponent implements OnInit {

  private session = inject(SessionService);
  private cdr = inject(ChangeDetectorRef);
  user: UserSession | null = null;
  ngOnInit() {
    this.session.getMe().subscribe({
      next: (data) => {
        this.user = data;
        this.cdr.markForCheck();
      }
    });
  }

  get initial(): string {
    return this.user?.fullName?.charAt(0).toUpperCase() ?? 'U';
  }

}