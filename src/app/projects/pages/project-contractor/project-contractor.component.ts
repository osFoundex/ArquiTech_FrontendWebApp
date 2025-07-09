import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import {Project} from '../../model/project.entity';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {ProjectService} from '../../services/project.service';
import {AuthService} from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contractor-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatPaginator,
    TranslateModule
  ],
  templateUrl: './project-contractor.component.html',
  styleUrls: ['./project-contractor.component.css']
})
export class ProjectContractorComponent implements OnInit, AfterViewInit {
  protected dataSource!: MatTableDataSource<Project>;
  @ViewChild(MatPaginator) protected paginator!: MatPaginator;
  private projectService: ProjectService = inject(ProjectService);
  private authService: AuthService = inject(AuthService);
  userId: number | null = 0;

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.getContractorProjects();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private getContractorProjects() {
    if (this.userId) {
      this.projectService.getByContractorId(this.userId).subscribe((response: Project[]) => {
        this.dataSource.data = response;
      });
    }
  }

  protected handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.dataset['fallbackUsed']) {
      img.src = 'assets/images/fallback-construction.jpg';
      img.dataset['fallbackUsed'] = 'true'; // Mark it as fallback-applied
    } else {
      // Do nothing to prevent infinite loop
      console.warn('Fallback image also failed to load.');
    }
  }
}
