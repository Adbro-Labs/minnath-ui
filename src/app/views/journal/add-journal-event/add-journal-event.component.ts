import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { JournalService } from 'src/app/services/journal.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { JournalHeads } from "../../../models/journalHeads";

@Component({
  selector: 'app-add-journal-event',
  standalone: true,
  imports: [ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, ButtonModule, FormsModule, ReactiveFormsModule, FormModule ],
  templateUrl: './add-journal-event.component.html',
  styleUrl: './add-journal-event.component.scss'
})
export class AddJournalEventComponent implements OnInit{
  visible = false;
  journalEventForm!: FormGroup;
  journalEvents: JournalHeads[] = [];
  journalHeadList: JournalHeads[] = [];
  journalCategories = ['BANK_ACCOUNT', 'VEHICLE', 'WORK', 'CLIENT'];
  @Output() updated = new EventEmitter<boolean>();

  fb = inject(FormBuilder);
  journalService = inject(JournalService);

  ngOnInit(): void {
    this.initJournalEventForm();
    this.getAllJournalHeads();
  }

  handleLiveDemoChange(visibleState: boolean) {
    this.visible = visibleState;
  }
  toggleLiveDemo() {

    this.visible = !this.visible;
  }

  initJournalEventForm() {
    this.journalEventForm = this.fb.group({
      eventDescription: ['', Validators.required],
      headCode: [''],
      oppositeHeadCode: ['', Validators.required],
      headCategory: [''],
      transactionType: ['', Validators.required],
    });
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

  saveJournalEvent() {
    if (this.journalEventForm.valid) {
      this.journalService.saveJournalEvent(this.journalEventForm.value).subscribe({
        next: () => {
          this.updated.emit(true);
          this.visible = false;
          this.journalEventForm.reset();
        },
        error: (error) => {
          console.error(error);
        }
      })
    }
  }
}
