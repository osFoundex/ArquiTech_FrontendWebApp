import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {BaseService} from '../../shared/services/base.component';
import {Material} from '../model/material.entity';

const materialsResourceEndpointPath = environment.materialsEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class MaterialService extends BaseService<Material> {
  constructor() {
    super();
    this.resourceEndpoint = materialsResourceEndpointPath;
  }
}
