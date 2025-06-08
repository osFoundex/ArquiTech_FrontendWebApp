import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerContractorComponent } from './worker-contractor.component';

describe('WorkerContractorComponent', () => {
  let component: WorkerContractorComponent;
  let fixture: ComponentFixture<WorkerContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerContractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
