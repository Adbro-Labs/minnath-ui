import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVariantsComponent } from './add-variants.component';

describe('AddVariantsComponent', () => {
  let component: AddVariantsComponent;
  let fixture: ComponentFixture<AddVariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVariantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
