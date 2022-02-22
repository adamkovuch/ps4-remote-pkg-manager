import { TestBed } from '@angular/core/testing';

import { Ps4PkgService } from './ps4-pkg.service';

describe('Ps4PkgService', () => {
  let service: Ps4PkgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ps4PkgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
