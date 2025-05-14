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

import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
@Component({
  selector: 'app-course-management',
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
    TranslateModule,
    RouterLink

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
      'project_id'
    ];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected editMode: boolean = false;

  protected dataSource!: MatTableDataSource<any>;

  private workerService: workerService = inject(workerService);

  route: ActivatedRoute=inject(ActivatedRoute);
  projectId=0;


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

  protected onEditItem(item: Worker) {
    this.editMode = true;
    this.workerData = item;
  }

  protected onDeleteItem(item: Worker) {
    this.deleteworker(item.worker_id);
  }

  protected onCancelRequest() {
    this.resetEditState();
    this.getAllworkers();
  }

  private resetEditState() {
    this.workerData = new Worker({});
    this.editMode = false;
  }

  protected onCourseAddRequested(item: Worker) {
    this.workerData = item;
    this.createworker();
    this.resetEditState()
  }

  protected onCourseUpdateRequested(item: Worker) {
    this.workerData = item;
    this.updateworker();
    this.resetEditState()
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

  private getworkerByProjectId() {
    this.workerService.getAll().subscribe((response: Array<Worker>) => {
      this.dataSource.data = response;
    })
  }


  private createworker() {
    this.workerService.create(this.workerData).subscribe((response: Worker) => {
      this.dataSource.data.push(response);
      this.dataSource.data = this.dataSource.data;
    })
  }

  private updateworker() {
    let materialToUpdate = this.workerData;
    this.workerService.update(materialToUpdate.worker_id, materialToUpdate).subscribe( (response: Worker) => {
      let index = this.dataSource.data.findIndex( (course: Worker) =>
        course.worker_id === response.worker_id);
      this.dataSource.data[index] = response;
      this.dataSource.data = this.dataSource.data;
    })
  }

  private deleteworker(id: number) {
    this.workerService.delete(id).subscribe( () => {
      this.dataSource.data = this.dataSource.data.filter( (material: Worker) => material.worker_id !== id);
    })
  }
}
