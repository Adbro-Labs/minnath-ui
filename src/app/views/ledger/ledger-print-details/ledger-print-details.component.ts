import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { Locations } from 'src/app/models/location';
import { BankService } from 'src/app/services/bank.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-ledger-print-details',
  standalone: true,
  imports: [ModalComponent, ModalHeaderComponent, ModalBodyComponent, ModalFooterComponent, ButtonModule, FormsModule, ReactiveFormsModule, FormModule ],
  templateUrl: './ledger-print-details.component.html',
  styleUrl: './ledger-print-details.component.scss'
})
export class LedgerPrintDetailsComponent {
  visible = false;
  printForm!: FormGroup;
  @Output() updated = new EventEmitter<boolean>();
  locationList: Locations[] = [];

  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  fb = inject(FormBuilder);
  bankService = inject(BankService);
  locationService = inject(LocationService);

  initBankForm() {
    this.printForm = this.fb.group({
      title: ['', Validators.required],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.initBankForm();
  }

  confirmPrint() {
    this.updated.emit(this.printForm.value);
    this.printForm.reset();
  }

  
}
