import { ProjectEntity } from './project.entity';
import { MaterialEntity } from '../material/model/material.entity'

describe('ProjectEntity', 'MaterialEntity' () => {
  it('should create an instance', () => {
    expect(new ProjectEntity()).toBeTruthy();
  });
});
