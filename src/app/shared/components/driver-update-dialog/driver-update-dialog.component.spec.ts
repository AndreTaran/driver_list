import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverUpdateDialogComponent } from './driver-update-dialog.component';

describe('DriverUpdateDialogComponent', () => {
  let component: DriverUpdateDialogComponent;
  let fixture: ComponentFixture<DriverUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
