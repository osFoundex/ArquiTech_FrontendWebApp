import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitDateComponent } from './exit-date.component';

describe('ExitDateComponent', () => {
  let component: ExitDateComponent;
  let fixture: ComponentFixture<ExitDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExitDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
