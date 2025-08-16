import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { JournalService } from 'src/app/services/journal.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { JournalHeads } from "../../../models/journalHeads";

@Component({
  selector: 'app-add-journal-head',
  standalone: true,
  imports: [ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, ButtonModule, FormsModule, ReactiveFormsModule, FormModule ],
  templateUrl: './add-journal-head.component.html',
  styleUrl: './add-journal-head.component.scss'
})
export class AddJournalHeadComponent implements OnInit{
  visible = false;
  journalHeadForm!: FormGroup;
  journalHeads: JournalHeads[] = [];
  journalCategories = ['BANK_ACCOUNT', 'VEHICLE', 'WORK', 'CLIENT'];
  @Output() updated = new EventEmitter<boolean>();

  fb = inject(FormBuilder);
  journalService = inject(JournalService);

  ngOnInit(): void {
    this.initHeadForm();
  }

  handleLiveDemoChange(visibleState: boolean) {
    this.visible = visibleState;
  }
  toggleLiveDemo() {
    this.journalHeadForm.reset();
    this.visible = !this.visible;
  }

  initHeadForm() {
     this.journalHeadForm = this.fb.group({
        headCode: [''],
        headName: ['', Validators.required],
        parentHeadCode: [null],
        headCategory: [null]
     });
  }

  saveJournalHead() {
    if (this.journalHeadForm.valid) {
      this.journalService.saveJournalHead(this.journalHeadForm.value).subscribe({
        next: () => {
          this.updated.emit(true);
          this.visible = false;
          this.journalHeadForm.reset();
        },
        error: (error) => {
          console.error(error);
        }
      })
    }
  }

}
