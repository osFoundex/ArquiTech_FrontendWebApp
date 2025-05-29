import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseService } from '../../shared/services/base.component';
import { Project } from '../model/project.entity';
import {Observable, retry} from 'rxjs';
import {catchError} from 'rxjs/operators';

const projectResourceEndpointPath = environment.projectEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseService<Project> {
  constructor() {
    super();
    this.resourceEndpoint = projectResourceEndpointPath;
  }

  // Add method to get projects by contractor_id
  getByContractorId(contractorId: number): Observable<Project[]> {
    return this.http
      .get<Project[]>(`${this.resourcePath()}?contractor_id=${contractorId}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
