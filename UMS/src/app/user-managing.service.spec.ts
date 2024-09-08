import { TestBed } from '@angular/core/testing';

import { UserManagingService } from './user-managing.service';

describe('UserManagingService', () => {
  let service: UserManagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
