import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeStatusToolbarComponent } from './home-status-toolbar.component';

describe('HomeStatusToolbarComponent', () => {
  let component: HomeStatusToolbarComponent;
  let fixture: ComponentFixture<HomeStatusToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeStatusToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeStatusToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
