import { Injectable } from '@angular/core';
import {UserEntity} from '../model/user.entity';
import {BaseService} from '../../shared/services/base.component';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService<UserEntity> {

  constructor() {
    super();
    this.resourceEndpoint = environment.usersEndpointPath;
  }
}
