import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule } from '@coreui/angular';
import { JournalService } from 'src/app/services/journal.service';
import { JournalEvent } from 'src/app/models/JournalEvent';
import { AddJournalEventComponent } from '../add-journal-event/add-journal-event.component';

@Component({
  selector: 'app-list-journal-events',
  standalone: true,
  imports: [ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, AddJournalEventComponent],
  templateUrl: './list-journal-events.component.html',
  styleUrl: './list-journal-events.component.scss'
})
export class ListJournalEventsComponent implements OnInit{
  @ViewChild('addJournalevent') addJournalEvent: AddJournalEventComponent | undefined;
  journalService = inject(JournalService);
  journalEvents: JournalEvent[] = [];

  ngOnInit(): void {
    this.getAllJournalEvents();
  }

  addJournalEventDetails() {
    if (this.addJournalEvent) {
      this.addJournalEvent.visible = true;
    }
  }

  getAllJournalEvents() {
    this.journalService.getAlljournalEvents().subscribe({
      next: (response) => {
        this.journalEvents = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
