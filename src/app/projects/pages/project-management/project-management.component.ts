import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../model/project.entity';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { ProjectService } from '../../services/project.service';
import { NgClass } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common'; // Añadido para *ngFor

@Component({
  selector: 'app-project-management',
  imports: [
    CommonModule, // Añadido para *ngFor
    RouterLink,
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
    MatCardModule,
    TranslateModule
  ],
  templateUrl: './project-management.component.html',
  styleUrls: [
    './project-management.component.css'
  ]
})
export class ProjectManagementComponent implements OnInit, AfterViewInit {
  protected projectData!: Project;

  protected columnsToString: string[] = [
    'image_url',
    'name',
    'budget',
    'status'
  ];

  @ViewChild(MatPaginator, { static: false })
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  protected editMode: boolean = false;

  protected dataSource!: MatTableDataSource<any>;

  private projectService: ProjectService = inject(ProjectService);
  route: ActivatedRoute = inject(ActivatedRoute);
  userId: number | null = 0;

  constructor(private AuthService: AuthService) {
    this.editMode = false;
    this.projectData = new Project({});
    this.dataSource = new MatTableDataSource();
    console.log(this.projectData);
  }

  ngOnInit(): void {
    this.userId = this.AuthService.getUserId();
    this.getAllProjects();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  protected onEditItem(item: Project) {
    this.editMode = true;
    this.projectData = item;
  }

  protected onDeleteItem(item: Project) {
    this.deleteMaterial(item.project_id);
  }

  protected onCancelRequest() {
    this.resetEditState();
    this.getAllProjects();
  }

  private resetEditState() {
    this.projectData = new Project({});
    this.editMode = false;
  }

  protected onCourseAddRequested(item: Project) {
    this.projectData = item;
    this.createMaterial();
    this.resetEditState();
  }

  protected onCourseUpdateRequested(item: Project) {
    this.projectData = item;
    this.updateMaterial();
    this.resetEditState();
  }

  private getAllProjects() {
    this.projectService.getAll().subscribe((response: Array<Project>) => {
      this.dataSource.data = response.filter(material => material.user_id === this.userId);
    });
  }

  private getProjectsByUserId() {
    this.projectService.getAll().subscribe((response: Array<Project>) => {
      this.dataSource.data = response;
    });
  }

  private createMaterial() {
    this.projectService.create(this.projectData).subscribe((response: Project) => {
      this.dataSource.data.push(response);
      this.dataSource.data = this.dataSource.data;
    });
  }

  private updateMaterial() {
    let materialToUpdate = this.projectData;
    this.projectService.update(materialToUpdate.project_id, materialToUpdate).subscribe((response: Project) => {
      let index = this.dataSource.data.findIndex((course: Project) =>
        course.project_id === response.project_id);
      this.dataSource.data[index] = response;
      this.dataSource.data = this.dataSource.data;
    });
  }

  private deleteMaterial(id: number) {
    this.projectService.delete(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((material: Project) => material.project_id !== id);
    });
  }

  protected handleImageError(event: Event): void {
    console.error('Error al cargar la imagen:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).src = 'assets/images/fallback-construction.jpg';
  }
}
