import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {Worker} from '../../model/worker.entity';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {workerService} from '../../services/worker.service';
import {NgClass} from '@angular/common';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import { GenericDialogComponent, DialogConfig } from '../../../shared/components/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-worker-management',
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
  templateUrl: './worker-management.component.html',
  styleUrl: './worker-management.component.css'
})
export class workersManagementComponent implements OnInit, AfterViewInit {

  protected workerData!: Worker;

  protected columnsToString: string[] =
    ['name',
      'role',
      'hired_date',
      'project_id',
      'actions'
    ];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected editMode: boolean = false;

  protected dataSource!: MatTableDataSource<any>;

  private workerService: workerService = inject(workerService);
  private dialog: MatDialog = inject(MatDialog);

  route: ActivatedRoute=inject(ActivatedRoute);
  projectId=0;
  id=0;


  constructor() {
    this.editMode = false;

    this.projectId=Number(this.route.snapshot.parent?.params['id']);
    this.workerData = new Worker({});
    this.dataSource = new MatTableDataSource();
    console.log(this.workerData);
  }

  ngOnInit(): void {
    this.getAllworkers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openAddDialog() {
    const config: DialogConfig = {
      titleKey: 'workers.add_title',
      submitKey: 'workers.form.submit',
      cancelKey: 'workers.form.cancel',
      fields: [
        { name: 'name', labelKey: 'workers.name', type: 'text', required: true },
        { name: 'role', labelKey: 'workers.w_role', type: 'text', required: true},
        { name: 'hired_date', labelKey: 'workers.hired_date', type: 'date', required: true }
      ]
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.workerService.create({
        id: this.id,
        project_id: this.projectId,
        ...result
      }).subscribe({
        next: response => {
          this.dataSource.data = [...this.dataSource.data, response];
        },
        error: err => {
          console.error('Error creando trabajador:', err);
        }
      });
    });
  }

  protected onEditItem(item: Worker) {
    const config: DialogConfig = {
      titleKey: 'workers.edit_title',
      submitKey: 'workers.form.update',
      cancelKey: 'workers.form.cancel',
      fields: [
        { name: 'name', labelKey: 'workers.name', type: 'text', required: true, value: item.name },
        { name: 'role', labelKey: 'workers.w_role', type: 'text', required: true, value: item.role},
        { name: 'hired_date', labelKey: 'workers.hired_date', type: 'date', required: true, value: item.hired_date }
      ]
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const updatedWorker = { ...item, ...result };
      this.workerService.update(item.id, updatedWorker).subscribe({
        next: response => {
          const index = this.dataSource.data.findIndex((w: Worker) => w.id === response.id);
          this.dataSource.data[index] = response;
          this.dataSource.data = [...this.dataSource.data];
        },
        error: err => {
          console.error('Error actualizando trabajador:', err);
        }
      });
    });
  }

  protected onDeleteItem(item: Worker) {
    this.deleteworker(item.id);
  }

  /**
   * Crud operations
   * @private
   */
  private getAllworkers() {
    this.workerService.getAll().subscribe((response: Array<Worker>) => {
      this.dataSource.data = response.filter(material => material.project_id===this.projectId);
    })
  }

  private deleteworker(id: number) {
    this.workerService.delete(id).subscribe( () => {
      this.dataSource.data = this.dataSource.data.filter( (material: Worker) => material.id !== id);
    })
  }
}
