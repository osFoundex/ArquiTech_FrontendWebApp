import { TestBed } from '@angular/core/testing';

import { ExitDateMaterialService } from './exit-date-material.service';

describe('ExitDateMaterialService', () => {
  let service: ExitDateMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExitDateMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
