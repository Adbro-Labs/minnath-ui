import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJournalEventComponent } from './add-journal-event.component';

describe('AddJournalEventComponent', () => {
  let component: AddJournalEventComponent;
  let fixture: ComponentFixture<AddJournalEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddJournalEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJournalEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
