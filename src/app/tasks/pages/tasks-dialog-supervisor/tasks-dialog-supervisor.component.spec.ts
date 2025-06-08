import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksDialogSupervisorComponent } from './tasks-dialog-supervisor.component';

describe('WorkerTasksDialogComponent', () => {
  let component: TasksDialogSupervisorComponent;
  let fixture: ComponentFixture<TasksDialogSupervisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksDialogSupervisorComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TasksDialogSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
