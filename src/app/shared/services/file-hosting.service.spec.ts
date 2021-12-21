import { TestBed } from '@angular/core/testing';

import { FileHostingService } from './file-hosting.service';

describe('FileHostingService', () => {
  let service: FileHostingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileHostingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
