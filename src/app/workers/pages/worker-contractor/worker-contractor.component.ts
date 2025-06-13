import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Worker } from '../../model/worker.entity';
import { MatPaginator } from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { workerService } from '../../services/worker.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  TasksDialogContractorComponent
} from '../../../tasks/pages/tasks-dialog-contractor/tasks-dialog-contractor.component';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-worker-contractor',
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatSortHeader,
    MatCellDef,
    MatIcon,
    MatHeaderRow,
    NgClass,
    MatRow,
    MatPaginator,
    MatHeaderRowDef,
    MatRowDef,

    MatIconModule,
    MatButtonModule,
    TranslateModule
  ],
  templateUrl: './worker-contractor.component.html',
  styleUrl: './worker-contractor.component.css'
})
export class WorkerContractorComponent implements OnInit, AfterViewInit {

  protected columnsToString: string[] = [
    'name',
    'role',
    'hired_date',
    'project_id',
    'tasks'
  ];

  protected dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: false })
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  private workerService: workerService = inject(workerService);
  private dialog: MatDialog = inject(MatDialog);
  route: ActivatedRoute = inject(ActivatedRoute);
  projectId = 0;

  constructor() {
    this.projectId = Number(this.route.snapshot.parent?.params['id']);
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.getAllworkers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private getAllworkers() {
    this.workerService.getAll().subscribe((response: Array<Worker>) => {
      this.dataSource.data = response.filter(worker => worker.project_id === this.projectId);
    });
  }

  openViewTasksDialog(worker: Worker) {
    this.dialog.open(TasksDialogContractorComponent, {
      width: '800px',
      data: { worker }
    });
  }
}
