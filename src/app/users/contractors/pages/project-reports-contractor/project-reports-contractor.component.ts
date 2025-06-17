import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {Incident} from '../../../../incidents/model/incident.entity';
import {IncidentService} from '../../../../incidents/services/incident.service';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {Project} from '../../../../projects/model/project.entity';
import {UserEntity} from '../../../model/user.entity';
import {TaskEntity} from '../../../../tasks/model/task.entity';
import {Material} from '../../../../materials/model/material.entity';
import {ActivatedRoute} from '@angular/router';
import {ProjectService} from '../../../../projects/services/project.service';
import {TaskService} from '../../../../tasks/services/task.service';
import {MaterialService} from '../../../../materials/services/material.service';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {CommonModule, NgClass} from '@angular/common';
import {UserService} from '../../../services/user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-project-reports-contractor',
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatIcon,
    MatIconModule,
    NgClass,
    TranslatePipe,
    MatButtonModule,
    MatPaginator,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './project-reports-contractor.component.html',
  styleUrl: './project-reports-contractor.component.css'
})
export class ProjectReportsContractorComponent implements OnInit, AfterViewInit {
  protected project!: Project;
  protected supervisor!: UserEntity;
  protected contractor!: UserEntity;

  protected doneTasksDataSource = new MatTableDataSource<TaskEntity>();
  protected entryMaterialsDataSource = new MatTableDataSource<Material>();
  protected exitMaterialsDataSource = new MatTableDataSource<Material>();
  protected incidentsDataSource = new MatTableDataSource<Incident>();
  protected projectInfoDataSource = new MatTableDataSource<any>();

  protected doneTasksColumns: string[] = ['description', 'start_date', 'due_date'];
  protected entryMaterialsColumns: string[] = ['name', 'quantity', 'unit_price', 'receipt_number', 'date'];
  protected exitMaterialsColumns: string[] = ['name', 'quantity_exit', 'unit_price', 'receipt_number', 'exit_date'];
  protected incidentsColumns: string[] = ['incident_type', 'date', 'severity', 'status'];
  protected projectInfoColumns: string[] = ['project-name', 'project_id', 'supervisor_name', 'contractor_name'];


  @ViewChild('doneTasksPaginator') doneTasksPaginator!: MatPaginator;
  @ViewChild('entryMaterialsPaginator') entryMaterialsPaginator!: MatPaginator;
  @ViewChild('exitMaterialsPaginator') exitMaterialsPaginator!: MatPaginator;
  @ViewChild('incidentsPaginator') incidentsPaginator!: MatPaginator;

  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private taskService = inject(TaskService);
  private materialService = inject(MaterialService);
  private incidentService = inject(IncidentService);

  protected projectId = 0;


  constructor() {
    this.doneTasksDataSource = new MatTableDataSource<TaskEntity>();
    this.entryMaterialsDataSource = new MatTableDataSource<Material>();
    this.exitMaterialsDataSource = new MatTableDataSource<Material>();
    this.incidentsDataSource = new MatTableDataSource<Incident>();
    this.projectId = Number(this.route.snapshot.parent?.params['id'] || this.route.snapshot.params['id']);
  }

  ngOnInit(): void {
    this.loadReportData();
  }

  ngAfterViewInit(): void {
    if (this.doneTasksPaginator) this.doneTasksDataSource.paginator = this.doneTasksPaginator;
    if (this.entryMaterialsPaginator) this.entryMaterialsDataSource.paginator = this.entryMaterialsPaginator;
    if (this.exitMaterialsPaginator) this.exitMaterialsDataSource.paginator = this.exitMaterialsPaginator;
    if (this.incidentsPaginator) this.incidentsDataSource.paginator = this.incidentsPaginator;
  }

  downloadPDF() {
    const data = document.getElementById('reportContent');
    if (!data) return;
    html2canvas(data).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ReporteSemanal.pdf');
    });
  }

  private loadReportData(): void {

    // Calcula el inicio y fin de la semana actual
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Lunes
    firstDayOfWeek.setHours(0, 0, 0, 0);
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    lastDayOfWeek.setHours(23, 59, 59, 999);

    if (!this.projectId) return;

    this.projectService.getById(this.projectId).subscribe(project => {
      this.project = project;

      // Cargar supervisor
      this.userService.getById(project.user_id).subscribe(supervisor => {
        this.supervisor = supervisor;

        // Cargar contratista

          this.userService.getById(project.contractor_id).subscribe(contractor => {
            this.contractor = contractor;

            // Llenar la tabla con los datos
            this.projectInfoDataSource.data = [{
              project_name: this.project.name,
              project_id: this.project.id,
              supervisor_name: this.supervisor.name,
              contractor_name: this.contractor.name
            }];
          });
      });
    });

    this.taskService.getAll().subscribe(tasks => {
      this.doneTasksDataSource.data = tasks.filter(t =>
        t.status === 'done' &&
        new Date(t.start_date) >= firstDayOfWeek &&
        new Date(t.start_date) <= lastDayOfWeek
      );
    });

    this.materialService.getAll().subscribe(materials => {
      this.entryMaterialsDataSource.data = materials.filter(m =>
        m.project_id === this.projectId &&
        m.entry_type === 'Entrada' &&
        new Date(m.date) >= firstDayOfWeek &&
        new Date(m.date) <= lastDayOfWeek
      );
      this.exitMaterialsDataSource.data = materials.filter(m =>
        m.project_id === this.projectId &&
        m.exit_type === 'Salida' &&
        new Date(m.date) >= firstDayOfWeek &&
        new Date(m.date) <= lastDayOfWeek
      );
    });

    this.incidentService.getAll().subscribe(incidents => {
      this.incidentsDataSource.data = incidents.filter(i =>
        new Date(i.date) >= firstDayOfWeek &&
        new Date(i.date) <= lastDayOfWeek
      );
    });
  }


}
