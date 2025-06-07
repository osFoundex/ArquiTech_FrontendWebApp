import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { TaskEntity } from '../model/task.entity';
import {BaseService} from '../../shared/services/base.component';

const tasksResourceEndpointPath = environment.tasksEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class TaskService extends BaseService<TaskEntity> {

  constructor() {
    super();
    this.resourceEndpoint = tasksResourceEndpointPath ;
  }

}
