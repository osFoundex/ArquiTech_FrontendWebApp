import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseService} from '../../shared/services/base.component';
import {Material} from '../model/material.entity';

/**
 * API Endpoint path for courses obtained from environment configuration
 */
const materialsResourceEndpointPath = environment.materialsEndpointPath;

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
export class MaterialService extends BaseService<Material>{

  constructor() {
    super();
    this.resourceEndpoint = materialsResourceEndpointPath ;
  }
}
