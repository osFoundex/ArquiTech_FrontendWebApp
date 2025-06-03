import { TestBed } from '@angular/core/testing';

import { EntryDateMaterialService } from './entry-date-material.service';

describe('EntryDateMaterialService', () => {
  let service: EntryDateMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntryDateMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
