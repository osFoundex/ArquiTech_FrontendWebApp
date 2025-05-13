import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryManagementComponent } from './machinery-management.component';

describe('MachineryManagementComponent', () => {
  let component: MachineryManagementComponent;
  let fixture: ComponentFixture<MachineryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineryManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
