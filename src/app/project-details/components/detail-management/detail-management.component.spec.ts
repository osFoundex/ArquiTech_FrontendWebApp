import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailManagementComponent } from './detail-management.component';

describe('DetailManagementComponent', () => {
  let component: DetailManagementComponent;
  let fixture: ComponentFixture<DetailManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
