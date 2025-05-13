import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {Material} from '../../model/material.entity';
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
import {MaterialService} from '../../services/material.service';
import {NgClass} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {ActivatedRoute} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
  templateUrl: './materials-management.component.html',
  styleUrl: './materials-management.component.css'
})
export class MaterialsManagementComponent implements OnInit, AfterViewInit {

  protected materialData!: Material;

  protected columnsToString: string[] =
    ['name',
      'quantity',
      'stock',
      'unit_price',
      'unit',
      'provider',
      'provider_ruc',
      'date',
      'receipt_number',
      'payment_method',
      'status'
    ];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected editMode: boolean = false;

  protected dataSource!: MatTableDataSource<any>;

  private materialService: MaterialService = inject(MaterialService);
  route: ActivatedRoute=inject(ActivatedRoute);
  projectId=0;

  constructor() {

    this.editMode = false;
    this.projectId=Number(this.route.snapshot.parent?.params['id']);

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

  protected onEditItem(item: Material) {
    this.editMode = true;
    this.materialData = item;
  }

  protected onDeleteItem(item: Material) {
    this.deleteMaterial(item.material_id);
  }

  protected onCancelRequest() {
    this.resetEditState();
    this.getAllMaterials();
  }

  private resetEditState() {
    this.materialData = new Material({});
    this.editMode = false;
  }

  protected onCourseAddRequested(item: Material) {
    this.materialData = item;
    this.createMaterial();
    this.resetEditState()
  }

  protected onCourseUpdateRequested(item: Material) {
    this.materialData = item;
    this.updateMaterial();
    this.resetEditState()
  }

  /**
   * Crud operations
   * @private
   */
  private getAllMaterials() {
    this.materialService.getAll().subscribe((response: Array<Material>) => {
      this.dataSource.data = response.filter(material => material.project_id===this.projectId);
    })
  }

  private getMaterialByProjectId() {
    this.materialService.getAll().subscribe((response: Array<Material>) => {
      this.dataSource.data = response;
    })
  }


  private createMaterial() {
    this.materialService.create(this.materialData).subscribe((response: Material) => {
      this.dataSource.data.push(response);
      this.dataSource.data = this.dataSource.data;
    })
  }

  private updateMaterial() {
    let materialToUpdate = this.materialData;
    this.materialService.update(materialToUpdate.material_id, materialToUpdate).subscribe( (response: Material) => {
      let index = this.dataSource.data.findIndex( (course: Material) =>
        course.material_id === response.material_id);
      this.dataSource.data[index] = response;
      this.dataSource.data = this.dataSource.data;
    })
  }

  private deleteMaterial(id: number) {
    this.materialService.delete(id).subscribe( () => {
      this.dataSource.data = this.dataSource.data.filter( (material: Material) => material.material_id !== id);
    })
  }
}
