import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {Material} from '../../model/material.entity';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {EntryDateMaterialService} from '../../services/entryDateMaterials/entry-date-material.service';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {DialogConfig, GenericDialogComponent} from '../../../shared/components/generic-dialog/generic-dialog.component';
import {MatButton} from '@angular/material/button';
import {NgClass} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIcon} from '@angular/material/icon';
import {ExitDateMaterialService} from '../../services/exitDateMaterials/exit-date-material.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-entry-date',
  imports: [
    MatButton,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    TranslatePipe,
    MatPaginator,
    MatHeaderCellDef,
    NgClass,
    RouterLink
  ],
  templateUrl: './entry-date.component.html',
  styleUrl: './entry-date.component.css'
})
export class EntryDateComponent implements OnInit, AfterViewInit {
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

  private entryMaterialService: EntryDateMaterialService = inject(EntryDateMaterialService);
  private exitMaterialService: ExitDateMaterialService = inject(ExitDateMaterialService);
  private snackBar: MatSnackBar = inject(MatSnackBar);
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

  openAddEntryDialog() {
    const config: DialogConfig = {
      titleKey: 'materials.add_title',
      submitKey: 'materials.form.submit',
      cancelKey: 'materials.form.cancel',
      fields: [
        { name: 'name', labelKey: 'materials.name', type: 'text', required: true, requiredMessageKey: 'materials.form.name_required'  },
        { name: 'quantity', labelKey: 'materials.quantity', type: 'number', required: true, requiredMessageKey: 'materials.form.quantity_required' },
        { name: 'unit_price', labelKey: 'materials.unit_price', type: 'number', required: true, requiredMessageKey: 'materials.form.unit_price_required' },
        { name: 'unit', labelKey: 'materials.unit', type: 'text', required: true, requiredMessageKey: 'materials.form.unit_required' },
        { name: 'provider', labelKey: 'materials.provider', type: 'text', required: true, requiredMessageKey: 'materials.form.provider_required' },
        { name: 'provider_ruc', labelKey: 'materials.provider_ruc', type: 'text', required: true, requiredMessageKey: 'materials.form.provider_ruc_required' },
        { name: 'date', labelKey: 'materials.date', type: 'date', required: true, requiredMessageKey: 'materials.form.date_required' },
        { name: 'receipt_number', labelKey: 'materials.receipt_number', type: 'text', required: true, requiredMessageKey: 'materials.form.receipt_number_required' },
        { name: 'payment_method',
          labelKey: 'materials.payment_method',
          type: 'select',
          required: true,
          requiredMessageKey: 'materials.form.payment_method',
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
          options: [
            { value: 'Received', labelKey: 'materials.status.received' },
            { value: 'Pending', labelKey: 'materials.status.pending' },
            { value: 'Canceled', labelKey: 'materials.status.canceled' }
          ]
        }
      ]
    };

    const dialogRefEntry = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRefEntry.afterClosed().subscribe(r => {
      if (!r) {
        return; // Si no hay resultado, salir
      }

      this.entryMaterialService.getAll().subscribe((materials: Material[]) => {
        const maxMaterialId = materials.length > 0
          ? Math.max(...materials.map(m => m.material_id || 0))
          : 0;
        const newMaterialId = maxMaterialId + 1;

        this.entryMaterialService.create({
          id: this.id,
          material_id: newMaterialId,
          project_id: this.projectId,
          ...r,
          mat_type: 'Entry'
        }).subscribe({
          next: response => {
            this.dataSource.data = [...this.dataSource.data, response];
          },
          error: err => {
            console.error('Error creando material:', err);
          }
        });
      });
    });
  }

  protected onEditItem(item: Material) {
    const config: DialogConfig = {
      titleKey: 'materials.edit_title',
      submitKey: 'materials.form.update',
      cancelKey: 'materials.form.cancel',
      fields: [
        { name: 'name', labelKey: 'materials.name', type: 'text', required: true, requiredMessageKey: 'materials.form.name_required',value: item.name },
        { name: 'quantity', labelKey: 'materials.quantity', type: 'number', required: true,  requiredMessageKey: 'materials.form.quantity_required', value: item.quantity },
        { name: 'unit_price', labelKey: 'materials.unit_price', type: 'number', required: true, requiredMessageKey: 'materials.form.unit_price_required', value: item.unit_price },
        { name: 'unit', labelKey: 'materials.unit', type: 'text', required: true, requiredMessageKey: 'materials.form.unit_required', value: item.unit },
        { name: 'provider', labelKey: 'materials.provider', type: 'text', required: true, requiredMessageKey: 'materials.form.provider_required', value: item.provider },
        { name: 'provider_ruc', labelKey: 'materials.provider_ruc', type: 'text', required: true, requiredMessageKey: 'materials.form.provider_ruc', value: item.provider_ruc },
        { name: 'date', labelKey: 'materials.date', type: 'date', required: true, requiredMessageKey: 'materials.form.date_required', value: item.date },
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

    const dialogRefEntry = this.dialog.open(GenericDialogComponent, {
      width: '600px',
      data: config
    });

    dialogRefEntry.afterClosed().subscribe(r => {
      if (!r) return;
      const updatedMaterialEntry = {
        ...item,
        ...r,
        mat_type: 'Entry'
      };

      if (typeof item.material_id === 'number') {
        this.updateAllByMaterialId(item.material_id, r);
      }

      this.entryMaterialService.update(item.id, updatedMaterialEntry).subscribe({
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
    // Actualiza en la tabla de entradas
    this.entryMaterialService.getAll().subscribe((entryMaterials: Material[]) => {
      entryMaterials
        .filter(m => m.material_id === material_id)
        .forEach(m => {
          this.entryMaterialService.update(m.id, { ...m, ...updatedFields }).subscribe();
        });
    });

    // Actualiza en la tabla de salidas
    this.exitMaterialService.getAll().subscribe((exitMaterials: Material[]) => {
      exitMaterials
        .filter(m => m.material_id === material_id)
        .forEach(m => {
          this.exitMaterialService.update(m.id, { ...m, ...updatedFields }).subscribe();
        });
    });
  }

  protected onDeleteItem(item: Material) {
    this.deleteMaterial(item.id);
  }

  //Método para abrir diálogo que pide cantidad y fecha salida
  openMoveToExitDialog(item: Material) {
    const config: DialogConfig = {
      titleKey: 'materials.move_to_exit_title',
      submitKey: 'materials.form.submit',
      cancelKey: 'materials.form.cancel',
      fields: [
        {
          name: 'quantityToMove',
          labelKey: 'materials.quantity_to_move',
          type: 'number',
          required: true,
          requiredMessageKey: 'materials.form.quantity_to_move_required',
          min: 1,
          max: item.stock // limitar máximo al stock actual
        },
        {
          name: 'exit_date',
          labelKey: 'materials.exit_date',
          type: 'date',
          required: true,
          requiredMessageKey: 'materials.form.exit_date_required',
        }
      ]
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '400px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.moveToExit(item, result.quantityToMove, result.exit_date);
    });
  }

  protected moveToExit(item: Material, quantityToMove: number, exitDate: string) {

    this.exitMaterialService.getAll().subscribe({
      next: (allExits: Material[]) => {

        const relatedExits = allExits.filter(exit =>
          exit.project_id === this.projectId &&
          exit.material_id === item.material_id
        );


        const totalMoved = relatedExits.reduce((sum, exit) => sum + Number(exit.quantity), 0);
        const newTotal = Number(totalMoved) + Number(quantityToMove);

        console.log('Total salidas actuales para este material:', totalMoved);
        console.log('Cantidad que quieres mover:', quantityToMove);
        console.log('Cantidad original disponible:', item.quantity);
        console.log('Suma total:', newTotal);
        console.log('Registros encontrados para salida:', relatedExits);


        if(quantityToMove > item.quantity){
          this.snackBar.open(
            `No puedes mover más cantidad de la que se registró originalmente. Tienes disponible ${item.quantity} y quieres mover ${quantityToMove}.`,
            'Cerrar',
            { duration: 10000, verticalPosition: 'top', horizontalPosition: 'center' }
          );
          return;
        }

        if (newTotal > item.quantity) {
          this.snackBar.open(
            `No puedes mover más cantidad de la que se registró originalmente. Ya moviste ${totalMoved} y quieres mover ${quantityToMove},
                      pero solo tienes disponible ${item.quantity}.`,
            'Cerrar',
            { duration: 10000,verticalPosition: 'top', horizontalPosition: 'center' }
          );
          return;
        }


        const { stock, ...rest } = item;

        const newExitMaterial: Material = {
          ...rest,
          id: 0,
          quantity: quantityToMove,
          exit_date: exitDate,
          project_id: this.projectId,
          mat_type: 'Exit',
          material_id: item.material_id
        };


        this.exitMaterialService.create(newExitMaterial).subscribe({
          next: () => {

            if (newTotal === item.quantity) {
              this.entryMaterialService.delete(item.id).subscribe(() => {
                this.dataSource.data = this.dataSource.data.filter(mat => mat.id !== item.id);
              });
            }
          },
          error: err => {
            console.error('Error al mover a salida:', err);
          }
        });
      },
      error: err => {
        console.error('Error al obtener las salidas:', err);
      }
    });
  }



  private getAllMaterials() {
    this.entryMaterialService.getAll().subscribe((response: Array<Material>) => {
      this.dataSource.data = response.filter(material => material.project_id===this.projectId && material.mat_type === 'Entry');
    })
  }


  private deleteMaterial(id: number) {
    this.entryMaterialService.delete(id).subscribe( () => {
      this.dataSource.data = this.dataSource.data.filter( (material: Material) => material.id !== id);
    })
  }
}

