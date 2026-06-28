import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserSession {
  fullName: string;
  role: 'OWNER' | 'ADMIN' | 'USER' | 'USER_SUPPLIER';
}

@Injectable({ providedIn: 'root' })
export class SessionService {

  private http = inject(HttpClient);

  getMe(): Observable<UserSession> {
    return this.http.get<UserSession>('/api/me');
  }
}