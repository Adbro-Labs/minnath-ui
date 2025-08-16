import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, RowComponent, FormModule } from '@coreui/angular';
import { Ledger } from 'src/app/models/ledger';
import { JournalHead } from 'src/app/models/journalHead';
import { JournalService } from 'src/app/services/journal.service';
import { LedgerService } from 'src/app/services/ledger.service';
import { FormsModule } from '@angular/forms';
import { LedgerPrintDetailsComponent } from "../ledger-print-details/ledger-print-details.component";
import { ProjectService } from 'src/app/services/project.service';
@Component({
  selector: 'app-view-ledger',
  standalone: true,
  imports: [FormsModule ,RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, DatePipe, FormModule, LedgerPrintDetailsComponent],
  providers: [DatePipe],
  templateUrl: './view-ledger.component.html',
  styleUrl: './view-ledger.component.scss'
})
export class ViewLedgerComponent implements OnInit {
  @ViewChild('ledgerPrinter') ledgerPrinter!: LedgerPrintDetailsComponent;
  ledgerList: Ledger[] = [];
  yearList = [2024, 2025, 2026, 2027];
  monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  journalHeadList: JournalHead[] = [];
  journalService = inject(JournalService);
  ledger = inject(LedgerService);
  service = inject(ProjectService);
  datePipe = inject(DatePipe);
  selectedAccount = "";
  year = new Date().getFullYear().toString();
  month = new Date().getMonth().toString();
  ngOnInit(): void {
    this.getAllJournalHeads();
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
  getLedgerList() {
    this.ledger.getAllLedgers(this.selectedAccount, this.year, this.month).subscribe({
      next: (response) => {
        this.ledgerList = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
  initiateLedgerPrint() {
    this.ledgerPrinter.visible = true;
  }
  initiatePrint(printDetails: any) {
    this.ledgerPrinter.visible = false;
    this.generateInvoice(printDetails);
  }
  generateInvoice(printDetails: any) {
    this.service.getLedgerTemplate().subscribe({
      next: (htmlString) => {
        var printWindow = window.open('', '', 'height=600,width=900');
        if (printWindow) {
          let workSummaryString = "";          
          this.ledgerList.forEach((x, i) => {
            workSummaryString = workSummaryString + `<tr>
              <td>${i+1}</td>
              <td>${this.datePipe.transform(x.journalDate, 'dd-MM-yyyy')}</td>
              <td>${x.journalDescription}</td>
              <td>${x.debitAmount}</td>
              <td>${x.creditAmount}</td>
              <td>${x.balance}</td>
            </tr>`;
          }); 
          htmlString = htmlString.replace('[WORK_SUMMARY]', workSummaryString);
          htmlString = htmlString.replace('[TITLE]', printDetails?.title);
          if (printDetails.note) {
            htmlString = htmlString.replace('[NOTE]', printDetails?.note);
          } else {
            htmlString = htmlString.replace('[NOTE]', printDetails?.note);
          }
          printWindow.document.write(`<html><head><title>Greenshore services</title>`);  
          printWindow.document.write('</head><body>');  
          printWindow.document.write(htmlString);
          printWindow.document.write('</body></html>');
          let marginTop = "";
          if (this.ledgerList.length > 19) {
            marginTop = "125px";
          } else {
            marginTop = "250px";
          }
          const element = printWindow.document.getElementById('body');
          if (element) {
            element.style.marginTop = marginTop;
          }
          printWindow.document.close();
          printWindow.addEventListener('load', () => {
            if (printWindow) {
              printWindow.print();
              printWindow.close();
            }
          });
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    })
  }
}
