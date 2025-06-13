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
  selector: 'app-materials-contractor',
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
  templateUrl: './materials-contractor.component.html',
  styleUrl: './materials-contractor.component.css'
})
export class MaterialsContractorComponent implements OnInit, AfterViewInit {
  protected materialData!: Material;

  protected columnsToString: string[] =
    [
      'material_id',
      'name',
      'stock',
      'unit_price',
      'unit'
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

}
