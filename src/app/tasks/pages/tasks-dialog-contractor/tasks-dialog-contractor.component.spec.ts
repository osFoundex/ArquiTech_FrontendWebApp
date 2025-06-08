import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDialogContractorComponent } from './tasks-dialog-contractor.component';

describe('TasksDialogContractorComponent', () => {
  let component: TasksDialogContractorComponent;
  let fixture: ComponentFixture<TasksDialogContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksDialogContractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksDialogContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
