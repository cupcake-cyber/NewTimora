import { TestBed } from '@angular/core/testing';

import { UserSession } from './user-session';

describe('UserSession', () => {
  let service: UserSession;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSession);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
