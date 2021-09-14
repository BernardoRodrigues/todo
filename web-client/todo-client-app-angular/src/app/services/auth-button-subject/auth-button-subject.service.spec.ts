import { TestBed } from '@angular/core/testing';

import { AuthButtonSubjectService } from './auth-button-subject.service';

describe('AuthButtonSubjectService', () => {
  let service: AuthButtonSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthButtonSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
