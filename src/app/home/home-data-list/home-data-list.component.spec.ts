import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDataListComponent } from './home-data-list.component';

describe('HomeDataListComponent', () => {
  let component: HomeDataListComponent;
  let fixture: ComponentFixture<HomeDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeDataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
