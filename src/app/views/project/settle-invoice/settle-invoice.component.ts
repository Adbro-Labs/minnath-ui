import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent, FormModule, FormCheckComponent, FormCheckInputDirective } from '@coreui/angular';
import { ClientService } from 'src/app/services/client.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-settle-invoice',
  standalone: true,
  imports: [ButtonModule, ModalBodyComponent, ModalComponent, ModalFooterComponent,
    ModalHeaderComponent, FormCheckComponent, FormCheckInputDirective, FormModule, FormsModule, ReactiveFormsModule],
  templateUrl: './settle-invoice.component.html',
  styleUrl: './settle-invoice.component.scss'
})
export class SettleInvoiceComponent implements OnInit{

  visible = false;
  clientList: any[] = [];
  pendingInvoiceList: any[] = [];
  clientCode = "";
  client = inject(ClientService);
  invoice = inject(InvoiceService);
  fb = inject(FormBuilder);
  settlementForm!: FormGroup;
  selectedInvoiceList: any[] = [];
  totalAmount = 0;
  partialPayment = 0;
  @Output() updated = new EventEmitter<boolean>();
  
  ngOnInit(): void {
    this.initSettlementForm();
    this.getAllClients();
    this.settlementForm.get('clientId')?.valueChanges.subscribe({next: (clientId: string) => {
      if (clientId) {
        this.getPendingInvoiceByClientId(clientId);
      }
    }});
  }

  getAllClients() {
    this.client.getAllActiveClients().subscribe({
      next: (response: any) => {
        this.clientList = response;
      }
    })
  }

  getPendingInvoiceByClientId(clientId: string) {
    this.invoice.getPendingInvoicesByClientCode(clientId).subscribe({
      next: (response: any) => {
        this.pendingInvoiceList = response.invoiceList;
        if (response.partialPayments && response.partialPayments.amount) {
          this.partialPayment = response.partialPayments.amount;
        }
      }
    });
  }

  initSettlementForm() {
    this.settlementForm = this.fb.group({
      amount: ['', Validators.required],
      description: ['', Validators.required],
      clientId: ['', Validators.required],
      invoiceCodes: [[], Validators.required]
    });
  }

  settleInvoice() {
    if (this.settlementForm.valid) {
      this.invoice.settleInvoices(this.settlementForm.value).subscribe({
        next: () => {
          this.settlementForm.reset();
          this.toggleLiveDemo();
          this.pendingInvoiceList = [];
          this.selectedInvoiceList = [];
          this.totalAmount = 0;
          this.updated.emit(true);
        }
      })
    }
  }

  cancelSettlement() {
    this.toggleLiveDemo();
    this.pendingInvoiceList = [];
    this.selectedInvoiceList = [];
    this.totalAmount = 0;
    this.settlementForm.reset();
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }
  handleLiveDemoChange(visibleStatus: boolean) {
    this.visible = visibleStatus;
  }

  calculateTotalAmount(item: any, event: any) {
    const checkbox = event.target as HTMLInputElement;
    let paymentAmount = this.settlementForm.get('amount')?.value;
    if (this.partialPayment) {
      paymentAmount += Number(this.partialPayment);
    }
    const checkedStatus = event?.target?.checked;
    if (checkedStatus) {
      const preTotal = this.totalAmount + Number(item.invoiceAmount);
      if (preTotal <= Number(paymentAmount)) {
        this.selectedInvoiceList.push(item);
      } else {
        checkbox.checked = false;
      }
    } else {
      const index = this.selectedInvoiceList.findIndex(x => x.invoiceCode == item.invoiceCode);
      if (index > -1) {
        this.selectedInvoiceList.splice(index, 1);
      }
    }
    this.totalAmount = 0;
    this.selectedInvoiceList.forEach(x => {
      this.totalAmount += Number(x.invoiceAmount);
      this.totalAmount = Number(this.totalAmount.toFixed(2));
    });
    this.settlementForm.patchValue({invoiceCodes: this.selectedInvoiceList.map(x => x.invoiceCode)});
  }
}
