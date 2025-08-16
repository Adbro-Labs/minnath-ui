import { Component, ViewChild, inject } from '@angular/core';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule } from '@coreui/angular';
import { JournalService } from 'src/app/services/journal.service';
import { JournalHead } from 'src/app/models/journalHead';
import { AddJournalHeadComponent } from "../add-journal-head/add-journal-head.component";

@Component({
  selector: 'app-list-journal-head',
  standalone: true,
  imports: [ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, AddJournalHeadComponent],
  templateUrl: './list-journal-head.component.html',
  styleUrl: './list-journal-head.component.scss'
})
export class ListJournalHeadComponent {
  journalHeadList: JournalHead[] = [];
  @ViewChild('addjournalhead') addJournalHead: AddJournalHeadComponent | undefined;
  journalService = inject(JournalService);
  journalEvents: JournalHead[] = [];

  ngOnInit(): void {
    this.getAllJournalHeads();
  }

  addJournalHeadDetails() {
    if (this.addJournalHead) {
      this.addJournalHead.visible = true;
      this.addJournalHead.journalHeads = this.journalHeadList;
    }
  }
  getAllJournalHeads() {
    this.journalService.getAllHeads().subscribe({
      next: (response) => {
        this.journalHeadList = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
}
