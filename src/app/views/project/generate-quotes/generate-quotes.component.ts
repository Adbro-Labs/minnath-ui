import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { QuoteListComponent } from '../quote-list/quote-list.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { ProjectService } from "../../../services/project.service";
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, FormModule } from '@coreui/angular';
import { ActivatedRoute } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-generate-quotes',
  standalone: true,
  imports: [QuoteListComponent, FormsModule, ReactiveFormsModule, ColComponent, FormModule, ButtonDirective, CardComponent, CardBodyComponent],
  templateUrl: './generate-quotes.component.html',
  styleUrl: './generate-quotes.component.scss'
})
export class GenerateQuoteComponent implements OnInit, AfterViewInit {
  clientCode = "";
  projectCode = "";
  clientList: any[] = [];
  projectList: any[] = [];
  clientService = inject(ClientService);
  projectService = inject(ProjectService);
  service = inject(ItemService);
  route = inject(ActivatedRoute);
  quoteFilterForm!: FormGroup;
  disableClient = false;

  @ViewChild('quoteList', {static: false}) quoteList: QuoteListComponent | undefined;

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe((response: any) => {
      if (response.id) {
        this.getQuoteDetailsById(response.id);
      }
    });
  }


  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: (response) => {
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

  getQuoteDetailsById(quoteId: string) {
    this.service.getQuoteDetailsById(quoteId).subscribe((response: any) => {
      this.clientCode = response.clientCode;
      console.log(this.quoteList)
      if (this.quoteList) {
        this.quoteList.quoteList = response.items;
        this.quoteList.quoteCode = response.id;
      }
      this.disableClient = true;
    })
  }
}
