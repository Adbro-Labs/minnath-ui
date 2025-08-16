import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListJournalComponent } from './list-journal.component';

describe('ListJournalComponent', () => {
  let component: ListJournalComponent;
  let fixture: ComponentFixture<ListJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListJournalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
