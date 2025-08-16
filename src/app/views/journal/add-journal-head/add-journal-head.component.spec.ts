import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJournalHeadComponent } from './add-journal-head.component';

describe('AddJournalHeadComponent', () => {
  let component: AddJournalHeadComponent;
  let fixture: ComponentFixture<AddJournalHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddJournalHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJournalHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
