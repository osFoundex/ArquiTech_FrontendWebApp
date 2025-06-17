import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../model/project.entity';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
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
import { ProjectService } from '../../services/project.service';
import { NgClass } from '@angular/common';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [
    CommonModule,
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
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit, AfterViewInit {
  protected projectData!: Project;
  protected columnsToDisplay: string[] = ['image_url', 'name', 'budget', 'status', 'contractor_id'];
  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  @ViewChild(MatSort) protected sort!: MatSort;
  protected editMode: boolean = false;
  protected dataSource!: MatTableDataSource<Project>;
  private projectService: ProjectService = inject(ProjectService);
  private authService: AuthService = inject(AuthService);
  route: ActivatedRoute = inject(ActivatedRoute);
  userId: number | null = 0;

  constructor() {
    this.editMode = false;
    this.projectData = new Project({});
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
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
    this.deleteProject(item.id);
  }

  protected onCancelRequest() {
    this.resetEditState();
    this.getAllProjects();
  }

  private resetEditState() {
    this.projectData = new Project({});
    this.editMode = false;
  }

  protected onProjectAddRequested(item: Project) {
    this.projectData = item;
    this.createProject();
    this.resetEditState();
  }

  protected onProjectUpdateRequested(item: Project) {
    this.projectData = item;
    this.updateProject();
    this.resetEditState();
  }

  private getAllProjects() {
    this.projectService.getAll().subscribe((response: Project[]) => {
      this.dataSource.data = response.filter(project => project.user_id === this.userId);
    });
  }

  private createProject() {
    this.projectService.create(this.projectData).subscribe((response: Project) => {
      this.dataSource.data.push(response);
      this.dataSource.data = this.dataSource.data;
    });
  }

  private updateProject() {
    const projectToUpdate = this.projectData;
    this.projectService.update(projectToUpdate.id, projectToUpdate).subscribe((response: Project) => {
      const index = this.dataSource.data.findIndex((project: Project) => project.id === response.id);
      this.dataSource.data[index] = response;
      this.dataSource.data = this.dataSource.data;
    });
  }

  private deleteProject(id: number) {
    this.projectService.delete(id).subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter((project: Project) => project.id !== id);
    });
  }

  protected handleImageError(event: Event): void {
    console.error('Error al cargar la imagen:', (event.target as HTMLImageElement).src);
    (event.target as HTMLImageElement).src = 'assets/images/fallback-construction.jpg';
  }
}
