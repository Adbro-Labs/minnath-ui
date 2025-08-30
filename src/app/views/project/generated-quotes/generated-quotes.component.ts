import { Component, inject, OnInit } from '@angular/core';
import { ButtonDirective, CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, FormModule, TableModule } from '@coreui/angular';
import { ButtonsComponent } from '../../buttons/buttons/buttons.component';
import { ItemService } from '../../../services/item.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generated-quotes',
  standalone: true,
  imports: [TableModule, CardBodyComponent, CardHeaderComponent, CardFooterComponent, CardComponent, ColComponent,
    ButtonsComponent, ButtonDirective, DatePipe, FormsModule, FormModule],
  templateUrl: './generated-quotes.component.html',
  styleUrl: './generated-quotes.component.scss'
})
export class GeneratedQuotesComponent implements OnInit {

  itemService = inject(ItemService);
  router = inject(Router);
  clientService = inject(ClientService);
  index = 0;

  quoteList: any[] = [];
  clientList: any[] = [];
  clientCode: string = "";

  ngOnInit(): void {
    this.loadClients();
  }

  getQuotes() {
    this.itemService.getAllQuotes(this.clientCode, this.index).subscribe({
      next: (response: any) => {
        this.quoteList = response?.data;
      }
    })
  }


  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (response) => {
        this.clientList = response;
      }
    })
  }

  viewQuote = (quoteDetails: any) => {
    let fileName = `${quoteDetails.clientName}-${quoteDetails.locationName}-${quoteDetails.id}.pdf`;
    fileName = fileName.split(" ").join("-");
    const filePath = environment.baseUrl + '/quotes/' + fileName;
    window.open(filePath);
  }

  editQuote(quoteDetails: any) {
    this.router.navigate(["/create-quote", quoteDetails.id]);
  }

  createQuote() {
    this.router.navigate(["/project/create-quote"]);
  }
}
