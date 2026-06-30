import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { Configuration } from '../../models/configuration';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {

  private http = inject(HttpClient);

  private readonly api = '/api/configurations';

  // 🔥 cache en memoria (evita refetch raro al cambiar rutas)
  private config$?: Observable<Configuration>;

  getMy(): Observable<Configuration> {
    if (!this.config$) {
      this.config$ = this.http.get<Configuration>(this.api).pipe(
        shareReplay(1)
      );
    }

    return this.config$;
  }

  patch(partial: Partial<Configuration>): Observable<Configuration> {
    return this.http.patch<Configuration>(this.api, partial);
  }

  // 🔥 útil cuando haces cambios o logout/login
  clearCache(): void {
    this.config$ = undefined;
  }
}