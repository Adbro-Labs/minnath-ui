import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListJournalHeadComponent } from './list-journal-head.component';

describe('ListJournalHeadComponent', () => {
  let component: ListJournalHeadComponent;
  let fixture: ComponentFixture<ListJournalHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListJournalHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListJournalHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
