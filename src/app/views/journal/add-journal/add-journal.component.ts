import { Component, EventEmitter, Output, inject } from '@angular/core';
import { JournalService } from 'src/app/services/journal.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { JournalEvent } from 'src/app/models/JournalEvent';
import { JournalHead } from 'src/app/models/journalHead';

@Component({
  selector: 'app-add-journal',
  standalone: true,
  imports: [ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, ButtonModule, FormsModule, ReactiveFormsModule, FormModule ],
  templateUrl: './add-journal.component.html',
  styleUrl: './add-journal.component.scss'
})
export class AddJournalComponent {

  visible = false;
  journalForm!: FormGroup;
  journalEvents: JournalEvent[] = [];
  journalHeadList: JournalHead[] = [];
  tempJournalHeadList: JournalHead[] = [];
  @Output() updated = new EventEmitter<boolean>();

  fb = inject(FormBuilder);
  journalService = inject(JournalService);

  ngOnInit(): void {
    this.initJournalForm();
    this.getAllJournalHeads();
    this.journalForm.get('journalEventCode')?.valueChanges.subscribe({
      next: (selectedEventCode) => {
        this.processJournalEvent(selectedEventCode);
      }
    })
    this.getAllJournalEvents();
  }

  processJournalEvent(selectedEventCode: string) {
    this.tempJournalHeadList = [];
    const selectedJournalEvent = this.journalEvents.find(x => x.eventCode == selectedEventCode);
    if (!selectedJournalEvent?.headCode) {
      const headCategory = selectedJournalEvent?.headCategory;
      if (headCategory) {
        this.tempJournalHeadList = this.journalHeadList.filter(x => x?.headCategory == headCategory);
      } else {
        this.tempJournalHeadList = [];
      }      
    } else {
      this.journalForm.get('journalHeadCode')?.setValue(selectedJournalEvent?.headCode);
    }
    this.journalForm.get('oppositeHeadCode')?.setValue(selectedJournalEvent?.oppositeHeadCode);
    this.journalForm.get('transactionType')?.setValue(selectedJournalEvent?.transactionType);
  }

  initJournalForm() {
    this.journalForm = this.fb.group({
      journalEventCode: [Validators.required],
      journalHeadCode: ['', Validators.required],
      oppositeHeadCode: ['', Validators.required],
      journalDescription: ['', Validators.required],
      transactionType: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  handleLiveDemoChange(visibleStatus: boolean) {
    window.blur();
    this.journalForm.reset();
    this.visible = visibleStatus;
  }

  getAllJournalEvents() {
    this.journalService.getAlljournalEvents().subscribe({
      next: (response) => {
        this.journalEvents = response;
      },
      error: (error) => {
        console.error(error);
      }
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

  toggleLiveDemo() {
    this.journalForm.reset();
    window.blur();
    this.visible = !this.visible;
  }

  saveJournal() {
    console.log(this.journalForm.value)
    if (this.journalForm.valid) {
      this.journalService.saveJournal(this.journalForm.value).subscribe({
        next: (response) => {
          this.updated.emit(true);
          this.journalForm.reset();
          this.handleLiveDemoChange(false);
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }
}
