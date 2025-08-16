import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule } from '@coreui/angular';
import { AddJournalComponent } from "../add-journal/add-journal.component";
import { JournalService } from 'src/app/services/journal.service';
import { Journal } from 'src/app/models/journal';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-list-journal',
  standalone: true,
  imports: [ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, AddJournalComponent, DatePipe],
  templateUrl: './list-journal.component.html',
  styleUrl: './list-journal.component.scss'
})
export class ListJournalComponent implements OnInit{
  @ViewChild('addjournal') addJournal: AddJournalComponent | undefined;
  journalService = inject(JournalService);
  journalList: Journal[] = [];

  ngOnInit(): void {
    this.getJournalList();
  }

  getJournalList() {
    this.journalService.getAllJournals().subscribe({
      next: (response) => {
        this.journalList = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  addJournalEntry() {
    if (this.addJournal) {
      this.addJournal.visible = true;
    }
  }
}
