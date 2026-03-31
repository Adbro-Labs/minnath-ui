import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { QuoteListComponent } from "../quote-list/quote-list.component";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ClientService } from "../../../services/client.service";
import { ProjectService } from "../../../services/project.service";
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  FormModule,
} from "@coreui/angular";
import { ActivatedRoute } from "@angular/router";
import { ItemService } from "../../../services/item.service";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@Component({
  selector: "app-generate-quotes",
  standalone: true,
  imports: [
    QuoteListComponent,
    FormsModule,
    ReactiveFormsModule,
    ColComponent,
    MatAutocompleteModule,
    FormModule,
    ButtonDirective,
    CardComponent,
    CardBodyComponent,
  ],
  templateUrl: "./generate-quotes.component.html",
  styleUrl: "./generate-quotes.component.scss",
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
  searchControl = new FormControl("");

  @ViewChild("quoteList", { static: false }) quoteList:
    | QuoteListComponent
    | undefined;

  ngOnInit(): void {
    this.loadClients();
    this.searchControl.valueChanges.subscribe((value) => {
      if (typeof value === "string") {
        this.loadClients();
      }
    });
  }

  displayFn(user: any): string {
    return user && user.clientName ? user.clientName : "";
  }

  onClientSelected(clientDetails: any) {
    this.clientCode = clientDetails.clientCode;
    if (this.quoteList) {
      this.quoteList.clientCode = this.clientCode;
      this.quoteList?.loadDraftQuotes();
    }
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe((response: any) => {
      if (response.id) {
        this.getQuoteDetailsById(response.id);
      }
    });
  }

  loadClients() {
    this.clientService
      .getAllClients(0, this.searchControl.value || "")
      .subscribe({
        next: (response) => {
          this.clientList = response;
        },
      });
  }

  getProjectByClient() {
    if (this.quoteList) {
      this.quoteList.clientCode = this.clientCode;
      this.quoteList?.loadDraftQuotes();
    }
  }

  getQuoteDetailsById(quoteId: string) {
    this.service.getQuoteDetailsById(quoteId).subscribe((response: any) => {
      this.clientCode = response.clientCode;
      if (this.quoteList) {
        this.quoteList.quoteList = response.items;
        this.quoteList.quoteCode = response.id;
      }
      this.disableClient = true;
    });
  }
}
