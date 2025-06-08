import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsContractorComponent } from './materials-contractor.component';

describe('MaterialsContractorComponent', () => {
  let component: MaterialsContractorComponent;
  let fixture: ComponentFixture<MaterialsContractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialsContractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialsContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
