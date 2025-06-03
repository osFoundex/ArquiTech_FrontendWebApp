import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BaseService} from '../../../shared/services/base.component';
import {Material} from '../../model/material.entity';

const entryDateMaterialsResourceEndpointPath = environment.entryDateMaterialsEndpointPath;

@Injectable({
  providedIn: 'root'
})
export class EntryDateMaterialService extends BaseService<Material> {
  constructor() {
    super();
    this.resourceEndpoint = entryDateMaterialsResourceEndpointPath;
  }
}
