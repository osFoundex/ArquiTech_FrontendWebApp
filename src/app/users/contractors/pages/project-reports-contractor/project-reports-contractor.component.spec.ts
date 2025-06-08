import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReportsContractorComponent } from './project-reports-contractor.component';

describe('ProjectReportsContractorComponent', () => {
  let component: ProjectReportsContractorComponent;
  let fixture: ComponentFixture<ProjectReportsContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectReportsContractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectReportsContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
