import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { LPO } from 'src/app/models/lpo';

@Component({
  selector: 'app-manual-invoice',
  standalone: true,
  imports: [ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, ReactiveFormsModule],
  templateUrl: './manual-invoice.component.html',
  styleUrl: './manual-invoice.component.scss'
})
export class ManualInvoiceComponent implements OnInit{
  visible = false;
  @Output() updated = new EventEmitter<boolean>();
  invoiceForm!: FormGroup;
  lpoList: LPO[] | undefined = [];
  yearList = [2024, 2025, 2026, 2027];
  monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initInvoiceForm();
  }

  setDefaultValues() {
    this.invoiceForm.patchValue({
      year: new Date().getFullYear(),
      month: new Date().getMonth()
    });
  }

  initInvoiceForm() {
    this.invoiceForm = this.fb.group({
      lpoCode: [null, Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      month: [new Date().getMonth(), Validators.required]
    });
  }

  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
    if (!this.visible) {
      this.closeDialog();
    }
  }

  closeDialog() {
    this.invoiceForm.reset();
    this.setDefaultValues();
    this.visible = false;
  }

  generateInvoice() {
    if (this.invoiceForm.valid) {
      this.updated.emit(this.invoiceForm.value);
    }
  }
}
