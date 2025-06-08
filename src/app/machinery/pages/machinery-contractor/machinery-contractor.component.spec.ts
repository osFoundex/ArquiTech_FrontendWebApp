import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryContractorComponent } from './machinery-contractor.component';

describe('MachineryContractorComponent', () => {
  let component: MachineryContractorComponent;
  let fixture: ComponentFixture<MachineryContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachineryContractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MachineryContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
