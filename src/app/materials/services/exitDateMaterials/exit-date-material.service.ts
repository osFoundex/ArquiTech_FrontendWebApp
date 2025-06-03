import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BaseService} from '../../../shared/services/base.component';
import {Material} from '../../model/material.entity';

const exitDateMaterialsResourceEndpointPath = environment.exitDateMaterialsEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class ExitDateMaterialService extends BaseService<Material> {
  constructor() {
    super();
    this.resourceEndpoint = exitDateMaterialsResourceEndpointPath;
  }
}

