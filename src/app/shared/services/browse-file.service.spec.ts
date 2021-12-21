import { TestBed } from '@angular/core/testing';

import { BrowseFileService } from './browse-file.service';

describe('BrowseFileService', () => {
  let service: BrowseFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowseFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
