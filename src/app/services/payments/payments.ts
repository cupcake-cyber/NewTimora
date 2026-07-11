import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentDTO } from '../../models/payment';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private http = inject(HttpClient);
  private baseUrl = '/api/payments';

  getAll(): Observable<PaymentDTO[]> {
    return this.http.get<PaymentDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<PaymentDTO> {
    return this.http.get<PaymentDTO>(`${this.baseUrl}/${id}`);
  }

  getByBooking(bookingId: number): Observable<PaymentDTO[]> {
    return this.http.get<PaymentDTO[]>(`${this.baseUrl}/booking/${bookingId}`);
  }

  getByStatus(status: string): Observable<PaymentDTO[]> {
    return this.http.get<PaymentDTO[]>(`${this.baseUrl}/status?status=${status}`);
  }
}
