import { TestBed } from '@angular/core/testing';

import { ServicesService } from './service';

describe('ServicesService', () => {
  let service: ServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesService);
  });

  it('should be created', () => {
    expect(ServicesService).toBeTruthy();
  });
});
