import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Material} from '../../model/material.entity';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {NgClass, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs/operators';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import {MaterialService} from '../../services/material.service';
import {DialogConfig, GenericDialogComponent} from '../../../shared/components/generic-dialog/generic-dialog.component';
import {MatDialog} from '@angular/material/dialog';


@Component({
  selector: 'app-materials-management',
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatSortHeader,
    MatCellDef,
    MatIconModule,
    MatHeaderRow,
    NgClass,
    MatRow,
    MatPaginator,
    MatHeaderRowDef,
    MatRowDef,
    MatButtonModule,
    TranslateModule,
    NgIf,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './materials-management.component.html',
  styleUrl: './materials-management.component.css'
})
export class MaterialsManagementComponent implements OnInit, AfterViewInit {

  protected materialData!: Material;

  protected columnsToString: string[] =
    [
      'material_id',
      'name',
      'stock',
      'unit_price',
      'unit',
      'actions'
    ];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected dataSource!: MatTableDataSource<any>;
  id = 0;
  projectId=0;


  constructor(
    private materialService: MaterialService,
    private dialog: MatDialog,
    protected router: Router,
    private route: ActivatedRoute
  ) {
    this.projectId = Number(this.route.snapshot.parent?.params['id']);
    this.materialData = new Material({});
    this.dataSource = new MatTableDataSource();

    // Escuchar navegación para refrescar datos
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.getAllMaterials();
    });
  }

  ngOnInit(): void {
    this.getAllMaterials();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private getAllMaterials() {
    this.materialService.getAll().subscribe(entries => {

      // Filtrar las entradas por el proyecto actual
      const materialEntries = entries.filter(e => e.project_id === this.projectId);

      // Crear un resumen por material_id
      this.dataSource.data = materialEntries.map(entry => {
        const quantityIn = materialEntries.filter(e => e.material_id === entry.material_id)
          .reduce((sum, e) => sum + Number(e.quantity), 0);

        const quantityExit = materialEntries.filter(e => e.material_id === entry.material_id)
          .reduce((sum, e) => sum + Number(e.quantity_exit), 0);

        return {
          id: entry.material_id,  // usaremos esto como id interno
          name: entry.name,
          unit_price: entry.unit_price,
          unit: entry.unit,
          stock: quantityIn - quantityExit, // Calculamos el stock restando las salidas de las entradas
          material_id: entry.material_id
        } as Material;
      });

      // Filtrar solo los materiales con stock positivo, si es 0 no se muestra
      this.dataSource.data = this.dataSource.data.filter(m => m.stock > 0);

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }


  onEditItem(item: Material) {
    const config: DialogConfig = {
      titleKey: 'materials.edit_title',
      submitKey: 'materials.form.update',
      cancelKey: 'materials.form.cancel',
      fields: [
        { name: 'name', labelKey: 'materials.name', type: 'text', required: true, requiredMessageKey: 'materials.form.name_required', value: item.name },
        { name: 'unit_price', labelKey: 'materials.unit_price', type: 'number', required: true, requiredMessageKey: 'materials.form.unit_price_required', value: item.unit_price },
        { name: 'unit', labelKey: 'materials.unit', type: 'text', required: true, requiredMessageKey: 'materials.form.unit_required', value: item.unit },
      ]
    };

    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '500px',
      data: config
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const updated = {
        ...item,
        name: result.name,
        unit_price: result.unit_price,
        unit: result.unit
      };

      this.updateLinkedRecords(item, updated, () => {
        this.getAllMaterials(); // solo se ejecuta cuando TODO terminó
      });


    });
  }

  private updateLinkedRecords(oldItem: Material, updatedItem: Material, onComplete: () => void) {
    let pending = 0;

    // 1. Actualizar entradas
    this.materialService.getAll().subscribe(entries => {
      const toUpdate = entries.filter(e =>
        e.project_id === this.projectId && e.material_id === oldItem.material_id
      );
      pending += toUpdate.length;
      if (pending === 0) onComplete();

      toUpdate.forEach(entry => {
        const updated = {
          ...entry,
          name: updatedItem.name,
          unit_price: updatedItem.unit_price,
          unit: updatedItem.unit
        };
        this.materialService.update(entry.id, updated).subscribe(() => {
          pending--;
          if (pending === 0) onComplete();
        });
      });
    });

  }

}

