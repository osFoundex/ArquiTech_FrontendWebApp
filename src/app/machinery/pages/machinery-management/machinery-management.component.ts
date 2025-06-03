import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {Machinery} from '../../model/machinery.entity';
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
import {MachineryService} from '../../services/machinery.service';
import {NgClass} from '@angular/common';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import { GenericDialogComponent, DialogConfig } from '../../../shared/components/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-machinery-management',
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
  templateUrl: 'machinery-management.component.html',
  styleUrl: 'machinery-management.component.css'
})
export class MachineryManagementComponent implements OnInit, AfterViewInit {

  protected machineryData!: Machinery;

  protected columnsToString: string[] =
    [
      'name',
      'license_plate',
      'register_date',
      'status',
      'actions'
    ];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected editMode: boolean = false;

  protected dataSource!: MatTableDataSource<any>;
  private dialog: MatDialog = inject(MatDialog);
  private machineryService: MachineryService = inject(MachineryService);

  route: ActivatedRoute=inject(ActivatedRoute);
  projectId=0;
  id = 0;


  constructor() {
    this.editMode = false;

    this.projectId=Number(this.route.snapshot.parent?.params['id']);
    this.machineryData = new Machinery({});
    this.dataSource = new MatTableDataSource();
    console.log(this.machineryData);
  }

  ngOnInit(): void {
    this.getAllMachines();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openAddDialog() {
    const config: DialogConfig = {
      titleKey: 'machinery.add_title',
      submitKey: 'machinery.form.submit',
      cancelKey: 'machinery.form.cancel',
      fields: [
        { name: 'name', labelKey: 'machinery.name', type: 'text', required: true },
        { name: 'license_plate', labelKey: 'machinery.license_plate', type: 'text', required: true },
        { name: 'register_date', labelKey: 'machinery.register_date', type: 'date', required: true },
        {
          name: 'status',
          labelKey: 'machinery.m_status',
          type: 'select',
          required: true,
          options: [
            { value: 'Available', labelKey: 'machinery.status.available' },
            { value: 'Operational', labelKey: 'machinery.status.operational' },
            { value: 'Under Maintenance', labelKey: 'machinery.status.under_maintenance' }
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

      this.machineryService.create({
        id: this.id,
        project_id: this.projectId,
        ...result
      }).subscribe({
        next: response => {
          this.dataSource.data = [...this.dataSource.data, response];
        },
        error: err => {
          console.error('Error creando maquinaria:', err);
        }
      });
    });
  }

  protected onEditItem(item: Machinery) {
    const config: DialogConfig = {
      titleKey: 'machinery.edit_title',
      submitKey: 'machinery.form.update',
      cancelKey: 'machinery.form.cancel',
      fields: [
        { name: 'name', labelKey: 'machinery.name', type: 'text', required: true, value: item.name },
        { name: 'license_plate', labelKey: 'machinery.license_plate', type: 'text', required: true, value: item.license_plate },
        { name: 'register_date', labelKey: 'machinery.register_date', type: 'date', required: true, value: item.register_date },
        {
          name: 'status',
          labelKey: 'machinery.m_status',
          type: 'select',
          required: true,
          value: item.status,
          options: [
            { value: 'Available', labelKey: 'machinery.status.available' },
            { value: 'Operational', labelKey: 'machinery.status.operational' },
            { value: 'Under Maintenance', labelKey: 'machinery.status.under_maintenance' }
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
      const updatedMachinery = { ...item, ...result };
      this.machineryService.update(item.id, updatedMachinery).subscribe({
        next: response => {
          const index = this.dataSource.data.findIndex((m: Machinery) => m.id === response.id);
          this.dataSource.data[index] = response;
          this.dataSource.data = [...this.dataSource.data];
        },
        error: err => {
          console.error('Error actualizando maquinaria:', err);
        }
      });
    });
  }

  protected onDeleteItem(item: Machinery) {
    this.deleteMaterial(item.id);
  }

  /**
   * Crud operations
   * @private
   */
  private getAllMachines() {
    this.machineryService.getAll().subscribe((response: Array<Machinery>) => {
      this.dataSource.data = response.filter(material => material.project_id===this.projectId);
    })
  }


  private deleteMaterial(id: number) {
    this.machineryService.delete(id).subscribe( () => {
      this.dataSource.data = this.dataSource.data.filter( (material: Machinery) => material.id !== id);
    })
  }
}
