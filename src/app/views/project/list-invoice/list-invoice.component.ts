import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, TooltipDirective } from '@coreui/angular';
import { AddProjectComponent } from "../add-project/add-project.component";
import { InvoiceService } from 'src/app/services/invoice.service';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { ConfirmPopupComponent } from "../../widgets/confirm-popup/confirm-popup.component";
import { SettleInvoiceComponent } from "../settle-invoice/settle-invoice.component";
import { environment } from 'src/environments/environment';
import { IconDirective } from '@coreui/icons-angular';
@Component({
  selector: 'app-list-invoice',
  standalone: true,
  imports: [ConfirmPopupComponent, CardComponent, ColComponent, CardHeaderComponent,
    CardBodyComponent, TableDirective, ButtonModule, AddProjectComponent, DatePipe, CommonModule,
    SettleInvoiceComponent, IconDirective, TooltipDirective],
  providers: [DatePipe],
  templateUrl: './list-invoice.component.html',
  styleUrl: './list-invoice.component.scss'
})
export class ListInvoiceComponent implements OnInit {
  
  @ViewChild('confirmpopup') confirmpopup: ConfirmPopupComponent | undefined;
  @ViewChild('settleinvoice') settleinvoice: SettleInvoiceComponent | undefined;

  invoiceService = inject(InvoiceService);
  router = inject(Router);
  invoiceList: any[] = [];


  ngOnInit(): void {
    this.getAllInvoices();
  }

  getAllInvoices() {
    this.invoiceService.getAllInvoices().subscribe({
      next: (response) => {
        this.invoiceList = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  updateInvoiceStatus(paymentStatus: string, invoiceCode: string) {
    const request = {
      paymentStatus,
      invoiceCode
    };
    this.invoiceService.updateInvoiceStatus(request).subscribe({
      next: (response) => {
        const itemIndex = this.invoiceList.findIndex(x => x.invoiceCode == invoiceCode);
        if(itemIndex > -1) {
          this.invoiceList[itemIndex].status = 'PAID';
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  viewProject(projectCode: string) {
    this.router.navigate(['/project/byId', projectCode]);
  }

  showConfirmation(invoiceCode: string) {
    if (this.confirmpopup) {
      this.confirmpopup.invoiceCode = invoiceCode;
      this.confirmpopup.visible = true;
    }
  }
  viewInvoice(invoiceCode: string) {
    invoiceCode = invoiceCode.split("/").join("-");
    window.open(environment.baseUrl + `/invoices/${invoiceCode}.pdf`);
  }
  viewLetterHeadInvoice(invoiceCode: string) {
    invoiceCode = invoiceCode.split("/").join("-");
    window.open(environment.baseUrl + `/invoices/${invoiceCode}-letterhead.pdf`);
  }
  viewTripSummary(invoiceCode: string) {
    invoiceCode = invoiceCode.split("/").join("-");
    window.open(environment.baseUrl + `/tripSummary/${invoiceCode}-Trip-Summary.pdf`);
  }
  settleInvoices() {
    if (this.settleinvoice) {
      this.settleinvoice.visible = true;
    }
  }
}
