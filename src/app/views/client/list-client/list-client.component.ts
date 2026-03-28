import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, PaginationComponent, PageLinkDirective, PageItemDirective } from '@coreui/angular';
import { AddClientComponent } from "../add-client/add-client.component";
import { ClientService } from '../../../services/client.service';
import { ClientsWithBankDetails } from '../../../models/clients';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-client',
  standalone: true,
  imports: [CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective,
    ButtonModule, AddClientComponent, PaginationComponent, PageItemDirective, PageLinkDirective],
  templateUrl: './list-client.component.html',
  styleUrl: './list-client.component.scss'
})
export class ListClientComponent implements OnInit {
  @ViewChild('addClient') addClient: AddClientComponent | undefined;
  clientService = inject(ClientService);
  clientList: ClientsWithBankDetails[] = [];
  router = inject(Router);
  index = 0;

  ngOnInit(): void {
    this.getAllClients();
  }

  getAllClients() {
    this.clientService.getAllClients(this.index).subscribe({
      next: (response) => {
        this.clientList = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }


  addClients() {
    if (this.addClient) {
      this.addClient.visible = true;
    }
  } 
  editClient(item: any) {
    if (this.addClient) {
      this.addClient.clientForm.patchValue(item);
      this.addClient.visible = true;
    }
  } 
  logWork(clientDetails: any) {
    this.router.navigate(['/work-log', clientDetails.clientCode]);
  }
    paginate(operation: number) {
    const check = this.index + operation;
    if (check >= 0) {
      this.index = check;
      this.getAllClients();
    }
  }
}
