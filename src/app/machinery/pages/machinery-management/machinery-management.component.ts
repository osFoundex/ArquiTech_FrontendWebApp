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
      'estatus',

    ];

  @ViewChild(MatPaginator, {static: false})
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected editMode: boolean = false;

  protected dataSource!: MatTableDataSource<any>;

  private machineryService: MachineryService = inject(MachineryService);

  route: ActivatedRoute=inject(ActivatedRoute);
  projectId=0;


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

  protected onEditItem(item: Machinery) {
    this.editMode = true;
    this.machineryData = item;
  }

  protected onDeleteItem(item: Machinery) {
    this.deleteMaterial(item.machine_id);
  }

  protected onCancelRequest() {
    this.resetEditState();
    this.getAllMachines();
  }

  private resetEditState() {
    this.machineryData = new Machinery({});
    this.editMode = false;
  }

  protected onCourseAddRequested(item: Machinery) {
    this.machineryData = item;
    this.createMaterial();
    this.resetEditState()
  }

  protected onCourseUpdateRequested(item: Machinery) {
    this.machineryData = item;
    this.updateMaterial();
    this.resetEditState()
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

  private getMaterialByProjectId() {
    this.machineryService.getAll().subscribe((response: Array<Machinery>) => {
      this.dataSource.data = response;
    })
  }


  private createMaterial() {
    this.machineryService.create(this.machineryData).subscribe((response: Machinery) => {
      this.dataSource.data.push(response);
      this.dataSource.data = this.dataSource.data;
    })
  }

  private updateMaterial() {
    let materialToUpdate = this.machineryData;
    this.machineryService.update(materialToUpdate.machine_id, materialToUpdate).subscribe( (response: Machinery) => {
      let index = this.dataSource.data.findIndex( (course: Machinery) =>
        course.machine_id === response.machine_id);
      this.dataSource.data[index] = response;
      this.dataSource.data = this.dataSource.data;
    })
  }

  private deleteMaterial(id: number) {
    this.machineryService.delete(id).subscribe( () => {
      this.dataSource.data = this.dataSource.data.filter( (material: Machinery) => material.machine_id !== id);
    })
  }
}
