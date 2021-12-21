import { TestBed } from '@angular/core/testing';

import { Ps4RemoteService } from './ps4-remote.service';

describe('Ps4RemoteService', () => {
  let service: Ps4RemoteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ps4RemoteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
