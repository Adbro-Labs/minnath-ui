import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ButtonModule,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  TableModule,
} from '@coreui/angular';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { AddLPOComponent } from '../add-lpo/add-lpo.component';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { LpoService } from 'src/app/services/lpo.service';
import { LPO } from 'src/app/models/lpo';

import { GenerateInvoiceComponent } from '../generate-invoice/generate-invoice.component';
import { ManualInvoiceComponent } from '../manual-invoice/manual-invoice.component';

import { Transaction } from 'src/app/models/transaction';

import { NumberToWordsPipe } from '../../../utils/pipes/numtowordpipe';
import { environment } from 'src/environments/environment';
import dayjs from 'dayjs';
import { QuoteListComponent } from '../quote-list/quote-list.component';
@Component({
  selector: 'app-view-project',
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ButtonModule,
    ColComponent,
    TableModule,
    AddLPOComponent,
    AddTransactionComponent,
    GenerateInvoiceComponent,
    ManualInvoiceComponent,
    QuoteListComponent
  ],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.scss',
  providers: [NumberToWordsPipe],
})
export class ViewProjectComponent implements OnInit {
  projectTransactions: Transaction[] = [];
  projectSummaryList: Transaction[] = [];
  invoiceDetails: any;
  lpoType = {
    AMOUNT: 'Amount Based',
    QUANTITY: 'Quantity Based',
    DAYS: 'Days Based',
    UNLIMITED: 'Unlimited',
  };

  transactionTypes: any = {
      TSEWATER_SUPPLY_3000: 'Supply of TSE Water 3000 Gallon',
      SWEETWATER_SUPPLY_3000: 'Supply of Sweet Water 3000 Gallon',
      SWEETWATER_SUPPLY_3150: 'Supply of Sweet Water 3150 Gallon',
      SWEETWATER_SUPPLY_3500: 'Supply of Sweet Water 3500 Gallon',
      SWEETWATER_SUPPLY_4500: 'Supply of Sweet Water 4500 Gallon',
      SEWAGE_REMOVAL_4500: 'Sewage Removal 4500 Gallon',
      SEWAGE_REMOVAL_5000: 'Sewage Removal 5000 Gallon',
      SEWAGE_REMOVAL_6000: 'Sewage Removal 6000 Gallon',
      TSEWATER_SUPPLY_6000: 'Supply of TSE Water 6000 Gallon',
      TSEWATER_SUPPLY_6500: 'Supply of TSE Water 6500 Gallon',
      TSEWATER_SUPPLY_4500: 'Supply of TSE Water 4500 Gallon',
      SWEETWATER_SUPPLY: 'Supply of Sweet Water',
      SEWAGE_REMOVAL: 'Sewage Removal',
      VEHICLE_FUEL: 'Vehicle Fuel',
      'Trip Entry': 'Trip Entry',
      '7M3_SKIP': '7m3 Skip Removal',
      GENERAL_WASTE_REMOVAL: 'General Waste Removal',
      SEWAGE_COLLECTION: 'Sewage Water Collection and Disposal',
      DRAIN_EXT_6000: 'Drain Extracted water collection 6000 GL',
      JETT_TANKER: 'High pressure jetting tanker',
      DUMP_TRUCK_32C: 'Dump Truck 32 Cubic',
      FLATBED_40FT: 'Flatbed trailer 40 feet',
      DUMP_TRUCK_25T: 'Dump Truck 25 Ton'
  };

  projectDetails: Project | undefined;
  lpoDetails: LPO[] | undefined;

  @ViewChild('addlpo') lpoadd: AddLPOComponent | undefined;
  @ViewChild('addtransaction') addtransaction:
    | AddTransactionComponent
    | undefined;
  @ViewChild('generateInvoice') generateInvoice:
    | GenerateInvoiceComponent
    | undefined;
  @ViewChild('manualInvoice') manualInvoice: ManualInvoiceComponent | undefined;

  route = inject(ActivatedRoute);
  service = inject(ProjectService);
  lpoService = inject(LpoService);
  numbertoWords = inject(NumberToWordsPipe);

  ngOnInit(): void {
    this.getProjectDetails();
    this.getLPODetails();
    this.getProjectTransactions();
  }

  getProjectDetails() {
    const projectId = this.route.snapshot.params?.['id'];
    if (projectId) {
      this.service.getProjectDetails(projectId).subscribe({
        next: (response) => {
          this.projectDetails = response;
        },
      });
    }
  }

  getLPODetails() {
    const projectId = this.route.snapshot.params?.['id'];
    if (projectId) {
      this.lpoService.getLPOByProject(projectId).subscribe({
        next: (response) => {
          this.lpoDetails = response;
        },
      });
    }
  }

  addLPO() {
    const projectId = this.route.snapshot.params?.['id'];
    if (this.lpoadd && projectId) {
      this.lpoadd.lpoForm.get('projectCode')?.setValue(projectId);
      this.lpoadd.visible = true;
    }
  }

  editLPO(lpoDetails: any) {
    const projectId = this.route.snapshot.params?.['id'];
    if (this.lpoadd && projectId) {
      this.lpoadd.editMode = true;
      this.lpoadd.lpoForm.patchValue(lpoDetails);
      this.lpoadd.lpoForm.get('lpoType')?.disable();        
      this.lpoadd.visible = true;
    }
  }
  addTransactionDetails() {
    const projectId = this.route.snapshot.params?.['id'];
    const clientCode = this.projectDetails?.clientCode;
    if (this.addtransaction && projectId && clientCode) {
      this.addtransaction.transactionForm
        .get('projectCode')
        ?.setValue(projectId);
      this.addtransaction.transactionForm
        .get('clientCode')
        ?.setValue(clientCode);
      this.addtransaction.lpoDetails = this.lpoDetails;
      const previousTransactions: any = {};
      let lpoCodes = this.projectTransactions.map(x => x.lpoCode);
      lpoCodes = [...new Set(lpoCodes)]; 
      lpoCodes.forEach(x => {
        const transactions = this.projectTransactions.filter(y => y.lpoCode == x);
        let latestTransaction;
        let latestTimeStamp: number;
        transactions.forEach(x => {
          try {
            const splittedDate = x.transactionDate?.split("/");
            if (splittedDate && splittedDate.length > 0) {
              const timeStamp = new Date(Number(splittedDate[2]), Number(splittedDate[1])-1, Number(splittedDate[0])).getTime();
              if(timeStamp > latestTimeStamp || !latestTimeStamp) {
                latestTimeStamp = timeStamp;
                latestTransaction = x;
              }
            }
          } catch{

          }          
        });
        if (latestTransaction) {
          previousTransactions[x] = latestTransaction;
          latestTransaction = null;
          latestTimeStamp = 0;
        }
      });
      this.addtransaction.previousTransactions = previousTransactions;
      this.addtransaction.visible = true;
    }
  }

  getProjectTransactions() {
    const projectId = this.route.snapshot.params?.['id'];
    if (projectId) {
      this.service.getProjectTransactions(projectId).subscribe({
        next: (response) => {
          this.projectTransactions = response;
        },
      });
    }
  }

  generateProjectSummary(invoiceDetails: any) {
    const lpoCode = invoiceDetails.lpoCodde;
    const lpoDetails = this.lpoDetails?.find((x) => x.lpoCode == lpoCode);
    if (lpoDetails?.lpoType == 'MANUAL') {
      if (this.manualInvoice) {
        this.manualInvoice.visible = true;
      }
    } else {
      const projectId = this.route.snapshot.params?.['id'];
      if (projectId) {
        const filter = {
          projectId: this.projectDetails?.projectCode,
          lpoCode: invoiceDetails.lpoCode,
          fromDate: dayjs(invoiceDetails.fromDate).format('YYYY-MM-DD'),
          toDate: dayjs(invoiceDetails.toDate).format('YYYY-MM-DD'),
          invoiceDate: invoiceDetails.invoiceDate,
          invoiceNumber: invoiceDetails.invoiceNumber,
          invoiceConfirmed: invoiceDetails.invoiceConfirmed
        };
        this.service.getProjectSummary(filter).subscribe({
          next: (response: any) => {
            if(response.invoiceConfirmed) {
              this.projectSummaryList = response.invoiceSummary;
              this.invoiceDetails = response.invoiceSummary;
              this.openFile(environment.baseUrl + response.invoicePath);
              this.openFile(environment.baseUrl + response.summaryFilePath);
              this.generateInvoice?.closeDialog();
            } else {
              if (this.generateInvoice) {
                this.generateInvoice.invoiceCode = response.invoiceDetails.invoiceCode;
                let totalTrips = 0;
                let totalAmount = 0;
                response.invoiceSummary.forEach((x: any) => {
                  totalAmount += x.amount;
                  totalTrips += Number(x.tripCount);
                });
                this.generateInvoice.totalAmount = totalAmount?.toString();
                this.generateInvoice.totalTrips = totalTrips?.toString();
                this.generateInvoice.delveryNotes = response.tripSummary.map((x: any) => x.deliveryNoteNumber)?.join(",");
                this.generateInvoice.invoiceConfirmed = true;
              }
            }
          },
          error: (error) => {
            if (error?.error == 404 && this.generateInvoice) {
              this.generateInvoice.errorMessage = "No data found to generate invoice";
            } else if (error.status == 400 && this.generateInvoice) {
              this.generateInvoice.errorMessage = error.error;
            }
            if (this.generateInvoice) {
              this.generateInvoice.totalAmount = "";
              this.generateInvoice.totalTrips = "";
              this.generateInvoice.delveryNotes = "";
              this.generateInvoice.invoiceConfirmed = false;
              this.generateInvoice.invoiceCode = "";
            }
          }
        });
      }
    }
  }

  openFile(fileUrl: string) {
    window.open(fileUrl, '_Blank');
  }

  initiateInvoiceGeneration() {
    if (this.generateInvoice) {
      this.generateInvoice.visible = true;
      this.generateInvoice.lpoList = this.lpoDetails;
    }
  }

  getTripSummary(lpoCode: string) {
    this.service.getTripSummary(lpoCode).subscribe((data) => {
      console.log(data, 'trips');
    });
  }

  generateInvoiceContent() {
    this.service.getProjectInvoiceTemplate().subscribe({
      next: (htmlString) => {
        var printWindow = window.open('', '', 'height=600,width=900');
        if (printWindow) {
          if (this.projectDetails) {
            htmlString = htmlString.replace(
              '[CLIENT_NAME]',
              this.projectDetails.clientName
            );
            htmlString = htmlString.replace(
              '[PROJECT_PERSON]',
              this.projectDetails.contactPersonName
            );
            htmlString = htmlString.replace(
              '[CONTACT_NUMBER]',
              this.projectDetails.contactNumber
            );
            htmlString = htmlString.replace(
              '[PROJECT_NAME]',
              this.projectDetails.projectName
            );
          }
          let workSummaryString = '';
          let total = 0;

          this.projectSummaryList.forEach((x, i) => {
            const unit = this.lpoDetails?.find(
              (x) => x.lpoCode == x.lpoCode
            )?.lpoType;
            workSummaryString =
              workSummaryString +
              `<tr>
              <td>${i + 1}</td>
              <td>${this.transactionTypes[x?.transactionType]}</td>
              <td>${unit}</td>
              <td>${x?.quantity}</td>
              <td>${x?.unitPrice}</td>
              <td>${x?.amount}</td>
            </tr>`;
            total += x?.amount;
          });
          htmlString = htmlString.replace('[WORK_SUMMARY]', workSummaryString);
          htmlString = htmlString.replace(
            '[BANK_ACCOUNT_NUMBER]',
            `${this.projectDetails?.bankAccountNumber}, ${this.projectDetails?.bankName}` ||
              ''
          );
          if (this.projectDetails?.locationName) {
            htmlString = htmlString.replace(
              '[BANK_BRANCH]',
              `${this.projectDetails?.locationName} Branch`
            );
          } else {
            htmlString = htmlString.replace('[BANK_BRANCH]', '');
          }
          htmlString = htmlString.replace(
            '[BANK_IBAN]',
            this.projectDetails?.accountIBAN || ''
          );
          htmlString = htmlString.replace(
            '[TOTAL_DESCRIPTION]',
            `QATAREE RIYAL ${this.numbertoWords.transform(total)}`
          );
          printWindow.document.write(
            `<html><head><title>Greenshore services</title>`
          );
          printWindow.document.write('</head><body>');
          printWindow.document.write(htmlString);
          printWindow.document.write('</body></html>');
          setTimeout(() => {
            if (printWindow) {
              printWindow.print();
              printWindow.close();
            }
          }, 750);
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  viewLpoFile(fileName: string) {
    window.open(environment.baseUrl + `/lpo/${fileName}`);
  }

  editTransaction(item: any) {
    if (this.addtransaction) {
      const transactionDateList = item.transactionDate.split('/');
      let formattedDate;
      if (transactionDateList && transactionDateList.length > 0) {
        formattedDate = `${transactionDateList[2]}-${transactionDateList[1]}-${transactionDateList[0]}`;
      }
      item.clientCode = this.projectDetails?.clientCode;
      this.addtransaction.editMode = true;
      this.addtransaction.transactionForm.patchValue({...item, transactionDate: formattedDate});
      const projectId = this.route.snapshot.params?.['id'];
      const clientCode = this.projectDetails?.clientCode;
      if (this.addtransaction && projectId && clientCode) {
        this.addtransaction.transactionForm
          .get('projectCode')
          ?.setValue(projectId);
        this.addtransaction.transactionForm
          .get('clientCode')
          ?.setValue(clientCode);
        this.addtransaction.lpoDetails = this.lpoDetails;
        this.addtransaction.visible = true;
      }
    }
  }

}
