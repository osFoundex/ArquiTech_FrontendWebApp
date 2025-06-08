import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentContractorComponent } from './incident-contractor.component';

describe('IncidentContractorComponent', () => {
  let component: IncidentContractorComponent;
  let fixture: ComponentFixture<IncidentContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentContractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
