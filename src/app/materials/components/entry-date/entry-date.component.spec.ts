import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryDateComponent } from './entry-date.component';

describe('EntryDateComponent', () => {
  let component: EntryDateComponent;
  let fixture: ComponentFixture<EntryDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntryDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
