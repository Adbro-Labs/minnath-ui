import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListJournalEventsComponent } from './list-journal-events.component';

describe('ListJournalEventsComponent', () => {
  let component: ListJournalEventsComponent;
  let fixture: ComponentFixture<ListJournalEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListJournalEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListJournalEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
