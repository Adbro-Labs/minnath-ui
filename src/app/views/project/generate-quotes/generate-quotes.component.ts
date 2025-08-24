import { Component, inject, OnInit } from '@angular/core';
import { QuoteListComponent } from '../quote-list/quote-list.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { ProjectService } from "../../../services/project.service";
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, FormModule } from '@coreui/angular';

@Component({
  selector: 'app-generate-quotes',
  standalone: true,
  imports: [QuoteListComponent, FormsModule, ReactiveFormsModule, ColComponent, FormModule, ButtonDirective, CardComponent, CardBodyComponent],
  templateUrl: './generate-quotes.component.html',
  styleUrl: './generate-quotes.component.scss'
})
export class GenerateQuoteComponent implements OnInit {
  clientCode = "";
  projectCode = "";
  clientList: any[] = [];
  projectList: any[] = [];
  clientService = inject(ClientService);
  projectService = inject(ProjectService);
  quoteFilterForm!: FormGroup;

  ngOnInit(): void {
    this.loadClients();
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
}
