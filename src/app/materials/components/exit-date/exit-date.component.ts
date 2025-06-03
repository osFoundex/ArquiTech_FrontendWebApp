import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {MatButton} from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator} from '@angular/material/paginator';
import {Material} from '../../model/material.entity';
import {ExitDateMaterialService} from '../../services/exitDateMaterials/exit-date-material.service';
import {EntryDateMaterialService} from '../../services/entryDateMaterials/entry-date-material.service';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {DialogConfig, GenericDialogComponent} from '../../../shared/components/generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-exit-date',
  imports: [
    TranslatePipe,
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatSort,
    MatIcon,
    NgClass,
    MatPaginator,
    MatPaginator,
    RouterLink
  ],
  templateUrl: './exit-date.component.html',
  styleUrl: './exit-date.component.css'
})
export class ExitDateComponent implements OnInit, AfterViewInit {
  protected materialData!: Material;

  protected columnsToString: string[] =
    [
      'material_id',
      'name',
      'quantity',
      'unit_price',
      'unit',
      'provider',
      'provider_ruc',
      'date',
      'exit_date',
      'receipt_number',
      'payment_method',
      'status',
      'actions'
    ];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected dataSource!: MatTableDataSource<any>;
  id = 0;
  projectId=0;

  private exitMaterialService: ExitDateMaterialService = inject(ExitDateMaterialService);
  private entryMaterialService: EntryDateMaterialService = inject(EntryDateMaterialService);
  private dialog: MatDialog = inject(MatDialog);
  route: ActivatedRoute=inject(ActivatedRoute);

  constructor() {
    this.projectId=Number(this.route.parent?.parent?.snapshot.params['id']);

    this.materialData = new Material({});
    this.dataSource = new MatTableDataSource();
    console.log(this.materialData);
  }

  ngOnInit(): void {
    this.getAllMaterials();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openAddExitDialog() {
    const config: DialogConfig = {
      titleKey: 'materials.add_title',
      submitKey: 'materials.form.submit',
      cancelKey: 'materials.form.cancel',
      fields: [
        { name: 'name', labelKey: 'materials.name', type: 'text', required: true, requiredMessageKey: 'materials.name_required' },
        { name: 'quantity', labelKey: 'materials.quantity', type: 'number', required: true, requiredMessageKey: 'materials.quantity_required' },
        { name: 'unit_price', labelKey: 'materials.unit_price', type: 'number', required: true, requiredMessageKey: 'materials.unit_price_required' },
        { name: 'unit', labelKey: 'materials.unit', type: 'text', required: true, requiredMessageKey: 'materials.unit_required' },
        { name: 'provider', labelKey: 'materials.provider', type: 'text', required: true, requiredMessageKey: 'materials.provider_required' },
        { name: 'provider_ruc', labelKey: 'materials.provider_ruc', type: 'text', required: true, requiredMessageKey: 'materials.provider_ruc' },
        { name: 'date', labelKey: 'materials.date', type: 'date', required: true, requiredMessageKey: 'materials.date_required' },
        { name: 'receipt_number', labelKey: 'materials.receipt_number', type: 'text', required: true, requiredMessageKey: 'materials.receipt_number_required' },
        { name: 'payment_method',
          labelKey: 'materials.payment_method',
          type: 'select',
          required: true,
          requiredMessageKey: 'materials.payment_method',
          options: [
            {value: 'Cash', labelKey: 'materials.pay_method.cash'},
            {value: 'Transfer', labelKey: 'materials.pay_method.transfer'}
          ]
        },
        {
          name: 'status',
          labelKey: 'materials.m_status',
          type: 'select',
          required: true,
          requiredMessageKey: 'materials.m_status',
          options: [
            { value: 'Received', labelKey: 'materials.status.received' },
            { value: 'Pending', labelKey: 'materials.status.pending' },
            { value: 'Canceled', labelKey: 'materials.status.canceled' }
          ]
        }
      ]
    };

    const dialogRefExit = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRefExit.afterClosed().subscribe(res => {
      if (!res) {
        return; // Si no hay resultado, salir
      }

      this.exitMaterialService.create({
        id: this.id,
        project_id: this.projectId,
        mat_type: 'Exit',
        ...res,
        material_id: res.material_id
      }).subscribe({
        next: response => {
          this.getAllMaterials();
          //this.dataSource.data = [...this.dataSource.data, response];
        },
        error: err => {
          console.error('Error creando material:', err);
        }
      });
    });
  }

  protected onEditItem(item: Material) {
    const config: DialogConfig = {
      titleKey: 'materials.edit_title',
      submitKey: 'materials.form.update',
      cancelKey: 'materials.form.cancel',
      fields: [
        { name: 'name', labelKey: 'materials.name', type: 'text', required: true, requiredMessageKey: 'materials.form.name_required', value: item.name },
        { name: 'quantity', labelKey: 'materials.quantity', type: 'number', required: true, requiredMessageKey: 'materials.form.quantity_required', value: item.quantity },
        { name: 'unit_price', labelKey: 'materials.unit_price', type: 'number', required: true, requiredMessageKey: 'materials.form.unit_price_required', value: item.unit_price },
        { name: 'unit', labelKey: 'materials.unit', type: 'text', required: true, requiredMessageKey: 'materials.form.unit_required', value: item.unit },
        { name: 'provider', labelKey: 'materials.provider', type: 'text', required: true, requiredMessageKey: 'materials.form.provider_required', value: item.provider },
        { name: 'provider_ruc', labelKey: 'materials.provider_ruc', type: 'text', required: true, requiredMessageKey: 'materials.form.provider_ruc', value: item.provider_ruc },
        { name: 'date', labelKey: 'materials.date', type: 'date', required: true,  requiredMessageKey: 'materials.form.date_required', value: item.date },
        { name: 'exit_date', labelKey: 'materials.exit_date', type: 'date', required: true,  requiredMessageKey: 'materials.exit_date_required', value: item.exit_date },
        { name: 'receipt_number', labelKey: 'materials.receipt_number', type: 'text', required: true, requiredMessageKey: 'materials.form.receipt_number_required', value: item.receipt_number },
        { name: 'payment_method',
          labelKey: 'materials.payment_method',
          type: 'select',
          required: true,
          requiredMessageKey: 'materials.form.payment_method',
          value: item.payment_method,
          options: [
            {value: 'Cash', labelKey: 'materials.pay_method.cash'},
            {value: 'Transfer', labelKey: 'materials.pay_method.transfer'}
          ]
        },
        {
          name: 'status',
          labelKey: 'materials.m_status',
          type: 'select',
          required: true,
          requiredMessageKey: 'materials.form.m_status',
          value: item.status,
          options: [
            { value: 'Received', labelKey: 'materials.status.received' },
            { value: 'Pending', labelKey: 'materials.status.pending' },
            { value: 'Canceled', labelKey: 'materials.status.canceled' }
          ]
        }
      ]
    };

    const dialogRefExit = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRefExit.afterClosed().subscribe(res => {
      if (!res) return;
      const updatedMaterialExit = { ...item, ...res };

      if (typeof item.material_id === 'number') {
        this.updateAllByMaterialId(item.material_id, res);
      }

      this.exitMaterialService.update(item.id, updatedMaterialExit).subscribe({
        next: response => {
          const index = this.dataSource.data.findIndex((mat: Material) => mat.id === response.id);
          this.dataSource.data[index] = response;
          this.dataSource.data = [...this.dataSource.data];
        },
        error: err => {
          console.error('Error actualizando material:', err);
        }
      });
    });
  }

  private updateAllByMaterialId(material_id: number, updatedFields: Partial<Material>) {
    // Actualiza en la tabla de salidas
    this.exitMaterialService.getAll().subscribe((exitMaterials: Material[]) => {
      exitMaterials
        .filter(m => m.material_id === material_id)
        .forEach(m => {
          this.exitMaterialService.update(m.id, { ...m, ...updatedFields }).subscribe();
        });
    });

    // Actualiza en la tabla de entradas
    this.entryMaterialService.getAll().subscribe((entryMaterials: Material[]) => {
      entryMaterials
        .filter(m => m.material_id === material_id)
        .forEach(m => {
          this.entryMaterialService.update(m.id, { ...m, ...updatedFields }).subscribe();
        });
    });
  }

  protected onDeleteItem(item: Material) {
    this.deleteMaterial(item.id);
  }

  private getAllMaterials() {
    this.exitMaterialService.getAll().subscribe((response: Array<Material>) => {
      this.dataSource.data = response.filter(material => material.project_id===this.projectId && material.mat_type === 'Exit');
    })
  }

  private deleteMaterial(id: number) {
    this.exitMaterialService.delete(id).subscribe( () => {
      this.dataSource.data = this.dataSource.data.filter( (material: Material) => material.id !== id);
    })
  }
}
