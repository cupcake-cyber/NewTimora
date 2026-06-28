import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private http = inject(HttpClient);

  // UI state
  private _open = signal(false);

  open() {
    this._open.set(true);
  }

  close() {
    this._open.set(false);
  }

  toggle() {
    this._open.update(v => !v);
  }

  isOpen = this._open.asReadonly();

  // API
  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>('/api/notifications');
  }
}