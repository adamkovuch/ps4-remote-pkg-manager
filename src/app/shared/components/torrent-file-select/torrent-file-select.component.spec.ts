import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorrentFileSelectComponent } from './torrent-file-select.component';

describe('TorrentFileSelectComponent', () => {
  let component: TorrentFileSelectComponent;
  let fixture: ComponentFixture<TorrentFileSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TorrentFileSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TorrentFileSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
