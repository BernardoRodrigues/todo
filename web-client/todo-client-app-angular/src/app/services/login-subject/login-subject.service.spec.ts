import { TestBed } from '@angular/core/testing';

import { LoginSubjectService } from './login-subject.service';

describe('LoginSubjectService', () => {
  let service: LoginSubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginSubjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
