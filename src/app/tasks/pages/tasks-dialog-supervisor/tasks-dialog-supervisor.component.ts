import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource, MatColumnDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { TaskEntity } from '../../model/task.entity';
import { TaskService } from '../../services/task.service';
import { Worker } from '../../../workers/model/worker.entity';
import { GenericDialogComponent } from '../../../shared/components/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-tasks-dialog-supervisor',
  templateUrl: './tasks-dialog-supervisor.component.html',
  styleUrl: './tasks-dialog-supervisor.component.css',
  standalone: true,
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatButton,
    MatIconButton,
    MatIcon,
    TranslatePipe,
    NgClass,
    MatSortHeader
  ]
})

/*
  * Component to manage tasks for a specific worker.
  * It allows viewing, adding, editing, and deleting tasks.
  * It uses a dialog to display the tasks and a generic dialog for adding/editing tasks.
 */

export class TasksDialogSupervisorComponent implements OnInit, AfterViewInit {
  protected columnsToString: string[] = ['description', 'start_date', 'due_date', 'status', "description", 'actions'];
  protected dataSource: MatTableDataSource<TaskEntity>;
  protected worker: Worker;

  @ViewChild(MatSort) protected sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TasksDialogSupervisorComponent>,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {
    this.worker = data.worker;
    this.dataSource = new MatTableDataSource<TaskEntity>([]);
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  private loadTasks(): void {
    this.taskService.getAll().subscribe((tasks: TaskEntity[]) => {
      this.dataSource.data = tasks.filter(task => task.id_worker === this.worker.id);
    });
  }

  openAddTaskDialog(): void {
    const config = {
      titleKey: 'workers.tasks.add',
      submitKey: 'workers.tasks.form.create',
      cancelKey: 'workers.tasks.form.cancel',
      fields: [
        { name: 'description', labelKey: 'workers.tasks.description', type: 'text', required: true },
        { name: 'start_date', labelKey: 'workers.tasks.start_date', type: 'date', required: true },
        { name: 'due_date', labelKey: 'workers.tasks.due_date', type: 'date', required: true },
        { name: 'status', labelKey: 'workers.tasks.status', type: 'select', required: true, options: [
            { value: 'pending', label: 'workers.tasks.status_options.pending' },
            { value: 'in_progress', label: 'workers.tasks.status_options.in_progress' },
            { value: 'done', label: 'workers.tasks.status_options.done' }
          ]}
      ]
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '100%',
      data: config
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      this.taskService.create({
        ...result,
        id_worker: this.worker.id,
        id_project: this.worker.project_id
      }).subscribe({
        next: () => this.loadTasks(),
        error: (err: any) => console.error('Error creando tarea:', err)
      });
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  editTask(task: TaskEntity): void {
    const config = {
      titleKey: 'workers.tasks.edit',
      submitKey: 'workers.tasks.form.update',
      cancelKey: 'workers.tasks.form.cancel',
      fields: [
        { name: 'description', labelKey: 'workers.tasks.description', type: 'text', required: true, value: task.description },
        { name: 'start_date', labelKey: 'workers.tasks.start_date', type: 'date', required: true, value: task.start_date },
        { name: 'due_date', labelKey: 'workers.tasks.due_date', type: 'date', required: true, value: task.due_date },
        { name: 'status', labelKey: 'workers.tasks.status', type: 'select', required: true, value: task.status, options: [
            { value: 'pending', label: 'workers.tasks.status_options.pending' },
            { value: 'in_progress', label: 'workers.tasks.status_options.in_progress' },
            { value: 'done', label: 'workers.tasks.status_options.done' }
          ]}
      ]
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '500px',
      data: config
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
      const updatedTask = { ...task, ...result };
      this.taskService.update(task.id, updatedTask).subscribe({
        next: () => this.loadTasks(),
        error: (err: any) => console.error('Error actualizando tarea:', err)
      });
    });
  }

  deleteTask(task: TaskEntity): void {
    this.deleteTaskById(task.id);
  }

  private deleteTaskById(id: number): void {
    this.taskService.delete(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((task: TaskEntity) => task.id !== id);
    });
  }
}
