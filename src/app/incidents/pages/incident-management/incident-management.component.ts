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
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent, DialogConfig } from '../../../shared/components/generic-dialog/generic-dialog.component';


@Component({
  selector: 'app-incident-management',
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
      'status',
      'actions'
    ];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected editMode: boolean = false;

  protected dataSource!: MatTableDataSource<any>;

  private incidentService: IncidentService = inject(IncidentService);
  private dialog: MatDialog = inject(MatDialog);
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

  openAddDialog() {
    const config: DialogConfig = {
      titleKey: 'incidents.add_title',
      submitKey: 'incidents.form.submit',
      cancelKey: 'incidents.form.cancel',
      fields: [
        { name: 'date', labelKey: 'incidents.date', type: 'date', required: true },
        { name: 'incident_type', labelKey: 'incidents.incident_type', type: 'text', required: true },
        { name: 'severity',
          labelKey: 'incidents.i_severity',
          type: 'select',
          required: true,
          options: [
            { value: 'Low', labelKey: 'incidents.severity.low' },
            { value: 'Medium', labelKey: 'incidents.severity.medium' },
            { value: 'High', labelKey: 'incidents.severity.high' }
          ]},
        { name: 'status',
          labelKey: 'incidents.i_status',
          type: 'select',
          required: true,
          options: [
            { value: 'Pending', labelKey: 'incidents.status.pending' },
            { value: 'Resolved', labelKey: 'incidents.status.resolved' }
          ]}
      ]
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.incidentService.create({
        id: this.id,
        project_id: this.projectId,
        ...result
      }).subscribe({
        next: response => {
          this.dataSource.data = [...this.dataSource.data, response];
        },
        error: err => {
          console.error('Error creando incidente:', err);
        }
      });
    });
  }


  protected onEditItem(item: Incident) {
    const config: DialogConfig = {
      titleKey: 'incidents.edit_title',
      submitKey: 'incidents.form.update',
      cancelKey: 'incidents.form.cancel',
      fields: [
        { name: 'date', labelKey: 'incidents.date', type: 'date', required: true, value: item.date },
        { name: 'incident_type', labelKey: 'incidents.incident_type', type: 'text', required: true, value: item.incident_type },
        { name: 'severity',
          labelKey: 'incidents.i_severity',
          type: 'select',
          required: true,
          value: item.severity,
          options: [
            { value: 'Low', labelKey: 'incidents.severity.low' },
            { value: 'Medium', labelKey: 'incidents.severity.medium' },
            { value: 'High', labelKey: 'incidents.severity.high' }
          ]
        },
        { name: 'status',
          labelKey: 'incidents.i_status',
          type: 'select',
          required: true,
          value: item.status,
          options: [
            { value: 'Pending', labelKey: 'incidents.status.pending' },
            { value: 'Resolved', labelKey: 'incidents.status.resolved' }
          ]
        }
      ]
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const updatedIncident = { ...item, ...result };
      this.incidentService.update(item.id, updatedIncident).subscribe({
        next: response => {
          const index = this.dataSource.data.findIndex((inc: Incident) => inc.id === response.id);
          this.dataSource.data[index] = response;
          this.dataSource.data = [...this.dataSource.data];
        },
        error: err => {
          console.error('Error actualizando incidente:', err);
        }
      });
    });
  }

  protected onDeleteItem(item: Incident) {
    this.deleteMaterial(item.id);
  }

  private getAllIncidents() {
    this.incidentService.getAll().subscribe((response: Array<Incident>) => {
      this.dataSource.data = response.filter(material => material.project_id===this.projectId);
    })
  }

  private deleteMaterial(id: number) {
    this.incidentService.delete(id).subscribe( () => {
      this.dataSource.data = this.dataSource.data.filter( (material: Incident) => material.id !== id);
    })
  }
}
