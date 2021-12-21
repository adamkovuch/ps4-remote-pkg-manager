import { TestBed } from '@angular/core/testing';

import { HomeDataListService } from './home-data-list.service';

describe('HomeDataListService', () => {
  let service: HomeDataListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeDataListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
