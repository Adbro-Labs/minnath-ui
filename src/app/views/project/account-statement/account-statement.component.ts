import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, FormModule } from '@coreui/angular';
import { ClientService } from '../../../services/client.service';
import { InvoiceService } from '../../../services/invoice.service';
import { environment } from '../../../../environments/environment';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-account-statement',
  standalone: true,
  imports: [CardComponent, CommonModule, ColComponent, CardHeaderComponent, FormModule, CardBodyComponent, TableDirective, ButtonModule, DatePipe, FormsModule],
  templateUrl: './account-statement.component.html',
  styleUrl: './account-statement.component.scss'
})
export class AccountStatementComponent implements OnInit {
  year: number = new Date().getFullYear();
  month: number = new Date().getMonth() + 1;
  monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'];
  invoiceList: any = [];
  clientList: any[] = [];
  projectList: any[] = [];
  clientCode = "";
  projectCode = "";
  client = inject(ClientService);
  invoice = inject(InvoiceService);
  projectService = inject(ProjectService);

  ngOnInit(): void {
    this.getAllClients();
  }
  getAllClients() {
    this.client.getAllActiveClients().subscribe({
      next: (response: any) => {
        this.clientList = response;
      }
    })
  }
  getProjectByClient() {
    this.projectService.getAllProjects({clientCode: this.clientCode}).subscribe({
      next: (response: any) => {
        this.projectCode = "";
        this.projectList = response;
      }
    })
  }
  getPendingInvoices() {
    this.invoice.getAccountStatement(this.clientCode, this.projectCode).subscribe({
      next: (response: any) => {
        this.invoiceList = response?.accountStatement;
      }
    })
  }
  generateStatement() {
    this.invoice.generateStatement(this.clientCode, this.projectCode).subscribe({
      next: (response: any) => {
        let invoiceCode = response.statementFile;
        window.open(environment.baseUrl + invoiceCode);
      }
    })
  }
}
