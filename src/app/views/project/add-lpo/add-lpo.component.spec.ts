import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLPOComponent } from './add-lpo.component';

describe('AddLPOComponent', () => {
  let component: AddLPOComponent;
  let fixture: ComponentFixture<AddLPOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLPOComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
