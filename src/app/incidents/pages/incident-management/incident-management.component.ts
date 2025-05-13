import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {Incident} from '../../model/incident.entity';
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
import {IncidentService} from '../../services/incident.service';
import {NgClass} from '@angular/common';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute} from '@angular/router';
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
    TranslateModule
  ],
  templateUrl: './incident-management.component.html',
  styleUrl: './incident-management.component.css'
})
export class IncidentManagementComponent implements OnInit, AfterViewInit {

  protected incidentData!: Incident;

  protected columnsToString: string[] =
    [

  'date',
  'incident_type',
  'severity',
  'status'

    ];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected editMode: boolean = false;

  protected dataSource!: MatTableDataSource<any>;

  private incidentService: IncidentService = inject(IncidentService);

  route: ActivatedRoute=inject(ActivatedRoute);
  projectId=0;

  constructor() {
    this.editMode = false;

    this.projectId=Number(this.route.snapshot.parent?.params['id']);
    this.incidentData = new Incident({});
    this.dataSource = new MatTableDataSource();
    console.log(this.incidentData);
  }

  ngOnInit(): void {
    this.getAllIncidents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  protected onEditItem(item: Incident) {
    this.editMode = true;
    this.incidentData = item;
  }

  protected onDeleteItem(item: Incident) {
    this.deleteMaterial(item.incident_id);
  }

  protected onCancelRequest() {
    this.resetEditState();
    this.getAllIncidents();
  }

  private resetEditState() {
    this.incidentData = new Incident({});
    this.editMode = false;
  }

  protected onCourseAddRequested(item: Incident) {
    this.incidentData = item;
    this.createMaterial();
    this.resetEditState()
  }

  protected onCourseUpdateRequested(item: Incident) {
    this.incidentData = item;
    this.updateMaterial();
    this.resetEditState()
  }

  /**
   * Crud operations
   * @private
   */
  private getAllIncidents() {
    this.incidentService.getAll().subscribe((response: Array<Incident>) => {
      this.dataSource.data = response.filter(material => material.project_id===this.projectId);
    })
  }

  private getMaterialByProjectId() {
      this.incidentService.getAll().subscribe((response: Array<Incident>) => {
      this.dataSource.data = response;
    })
  }


  private createMaterial() {
    this.incidentService.create(this.incidentData).subscribe((response: Incident) => {
      this.dataSource.data.push(response);
      this.dataSource.data = this.dataSource.data;
    })
  }

  private updateMaterial() {
    let materialToUpdate = this.incidentData;
    this.incidentService.update(materialToUpdate.incident_id, materialToUpdate).subscribe( (response: Incident) => {
      let index = this.dataSource.data.findIndex( (course: Incident) =>
        course.incident_id === response.incident_id);
      this.dataSource.data[index] = response;
      this.dataSource.data = this.dataSource.data;
    })
  }

  private deleteMaterial(id: number) {
    this.incidentService.delete(id).subscribe( () => {
      this.dataSource.data = this.dataSource.data.filter( (material: Incident) => material.incident_id !== id);
    })
  }
}
