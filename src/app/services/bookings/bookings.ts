import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookingDTO } from '../../models/booking';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);
  private baseUrl = '/api/bookings';

  getAll(): Observable<BookingDTO[]> {
    return this.http.get<BookingDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<BookingDTO> {
    return this.http.get<BookingDTO>(`${this.baseUrl}/${id}`);
  }

  getByCustomer(customerId: number): Observable<BookingDTO[]> {
    return this.http.get<BookingDTO[]>(`${this.baseUrl}/customer/${customerId}`);
  }

  getByService(serviceId: number): Observable<BookingDTO[]> {
    return this.http.get<BookingDTO[]>(`${this.baseUrl}/service/${serviceId}`);
  }

  getBySupplier(supplierId: number): Observable<BookingDTO[]> {
    return this.http.get<BookingDTO[]>(`${this.baseUrl}/supplier/${supplierId}`);
  }

  getBySupplierAndRange(supplierId: number, startDate: string, endDate: string): Observable<BookingDTO[]> {
    return this.http.get<BookingDTO[]>(
      `${this.baseUrl}/supplier/${supplierId}/range?startDate=${startDate}&endDate=${endDate}`
    );
  }
}
