import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContractorComponent } from './project-contractor.component';

describe('ProjectContractorComponent', () => {
  let component: ProjectContractorComponent;
  let fixture: ComponentFixture<ProjectContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectContractorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProjectContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
