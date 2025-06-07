import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerTasksDialogComponent } from './worker-tasks-dialog.component';

describe('WorkerTasksDialogComponent', () => {
  let component: WorkerTasksDialogComponent;
  let fixture: ComponentFixture<WorkerTasksDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerTasksDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WorkerTasksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
