import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { PaymentsService } from './payments';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(PaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
