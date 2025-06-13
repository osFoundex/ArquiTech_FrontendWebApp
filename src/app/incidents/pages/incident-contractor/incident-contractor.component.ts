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
  selector: 'app-incident-contractor',
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
  templateUrl: './incident-contractor.component.html',
  styleUrl: './incident-contractor.component.css'
})
export class IncidentContractorComponent implements OnInit, AfterViewInit {
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
  id=0;

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

  private getAllIncidents() {
    this.incidentService.getAll().subscribe((response: Array<Incident>) => {
      this.dataSource.data = response.filter(material => material.project_id===this.projectId);
    })
  }

}
