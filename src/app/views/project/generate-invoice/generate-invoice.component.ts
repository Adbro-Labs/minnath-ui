import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule } from '@coreui/angular';
import { LpoService } from "../../../services/lpo.service";
import { LPO } from 'src/app/models/lpo';
import dayjs from 'dayjs';

@Component({
  selector: 'app-generate-invoice',
  standalone: true,
  imports: [ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, ReactiveFormsModule],
  templateUrl: './generate-invoice.component.html',
  styleUrl: './generate-invoice.component.scss'
})
export class GenerateInvoiceComponent implements OnInit {
  visible = false;
  @Output() updated = new EventEmitter<boolean>();
  invoiceForm!: FormGroup;
  lpoList: LPO[] | undefined = [];
  yearList = [2024, 2025, 2026, 2027];
  monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  fb = inject(FormBuilder);
  buttonLabel = "Generate Invoice";
  reviewLabel = "Review"
  errorMessage = "";
  minDate = null;
  totalTrips = "";
  delveryNotes = "";
  totalAmount = "";
  invoiceCode = "";
  invoiceConfirmed = false;

  ngOnInit(): void {
    this.initInvoiceForm();
  }

  setDefaultValues() {
    this.invoiceForm.patchValue({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      invoiceDate: dayjs(new Date()).format('YYYY-MM-DD')
    });
  }

  initInvoiceForm() {
    this.invoiceForm = this.fb.group({
      lpoCode: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      invoiceDate: [dayjs(new Date()).format('YYYY-MM-DD'), Validators.required],
      invoiceNumber: [null]
    });
    this.invoiceForm.get('lpoCode')?.valueChanges.subscribe(value => {
      if (value) {
        this.invoiceForm.get('fromDate')?.enable();
      } else {
        this.invoiceForm.get('fromDate')?.disable();
      }
    });
    this.invoiceForm.get('toDate')?.disable();
    this.invoiceForm.get('fromDate')?.valueChanges.subscribe(value => {
      if (value) {
        this.minDate = value;
        this.invoiceForm.get('toDate')?.enable();
      } else {
        this.invoiceForm.get('toDate')?.disable();
      }
    });
    this.invoiceForm.valueChanges.subscribe(() => {
      this.invoiceConfirmed = false;
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
    this.totalAmount = "";
    this.totalTrips = "";
    this.delveryNotes = "";
    this.invoiceCode = "";
    this.invoiceConfirmed = false;
  }

  generateInvoice() {
    if (this.invoiceForm.valid) {
      this.errorMessage = "";
      this.updated.emit({...this.invoiceForm.value, invoiceConfirmed: this.invoiceConfirmed});
    }
  }
}
