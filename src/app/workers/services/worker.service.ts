import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseService} from '../../shared/services/base.component';
import {Worker} from '../model/worker.entity';

/**
 * API Endpoint path for courses obtained from environment configuration
 */
const workersResourceEndpointPath = environment.workersEndpointPath;

/**
 * Service responsible for managing course-related HTTP operations.
 * Extends BaseService to provide CRUD operations for Course entities.
 *
 * Available operations inherited from BaseService:
 * -GET /api/courses - Retrieve all courses
 * -GET /api/courses/{id} - Retrieve a course by ID
 * -POST /api/courses - Create a new course
 * -PUT /api/courses/{id} - Update an existing course
 * -DELETE /api/courses/{id} - Delete a course
 */
@Injectable({
  providedIn: 'root'
})
export class workerService extends BaseService<Worker>{

  constructor() {
    super();
    this.resourceEndpoint = workersResourceEndpointPath ;
  }
}
