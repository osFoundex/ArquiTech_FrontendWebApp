import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource, MatColumnDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatHeaderCellDef, MatCellDef, MatHeaderRowDef, MatRowDef } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { TaskEntity } from '../../model/task.entity';
import { TaskService } from '../../services/task.service';
import { Worker } from '../../../workers/model/worker.entity';

@Component({
  selector: 'app-tasks-dialog-contractor',
  templateUrl: './tasks-dialog-contractor.component.html',
  styleUrl: './tasks-dialog-contractor.component.css',
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
export class TasksDialogContractorComponent implements OnInit, AfterViewInit{
  protected columnsToString: string[] = [
    'description',
    'start_date',
    'due_date',
    'status'
  ];
  protected dataSource: MatTableDataSource<TaskEntity>;
  protected worker: Worker;

  @ViewChild(MatSort) protected sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TasksDialogContractorComponent>,
    private taskService: TaskService
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

  close(): void {
    this.dialogRef.close();
  }

}
