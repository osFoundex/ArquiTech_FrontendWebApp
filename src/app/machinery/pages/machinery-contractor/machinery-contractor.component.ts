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
  selector: 'app-machinery-contractor',
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
  templateUrl: './machinery-contractor.component.html',
  styleUrl: './machinery-contractor.component.css'
})
export class MachineryContractorComponent implements OnInit, AfterViewInit {
  protected machineryData!: Machinery;

  protected columnsToString: string[] =
    [
      'name',
      'license_plate',
      'register_date',
      'status'
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

  /**
   * Crud operations
   * @private
   */
  private getAllMachines() {
    this.machineryService.getAll().subscribe((response: Array<Machinery>) => {
      this.dataSource.data = response.filter(material => material.project_id===this.projectId);
    })
  }

}
