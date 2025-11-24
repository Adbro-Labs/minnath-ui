import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule, FormModule } from '@coreui/angular';
import { ListGroupDirective, ListGroupItemDirective } from '@coreui/angular';
import { ItemService } from "../../../services/item.service";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quote-list',
  standalone: true,
  imports: [CardComponent, ColComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ButtonModule,
    FormModule, FormsModule, ReactiveFormsModule, ListGroupDirective, ListGroupItemDirective, MatAutocompleteModule],
  templateUrl: './quote-list.component.html',
  styleUrl: './quote-list.component.scss'
})
export class QuoteListComponent implements OnInit {
  itemList: any[] = [];
  quoteList: any[] = [];
  itemForm!: FormGroup;
  disableGenerate = false;
  quoteCode = "";
  service = inject(ItemService);
  fb = inject(FormBuilder);
  @Input() clientCode!: string;

  addItem() {
    if (this.itemForm.valid) {
      this.quoteList.push(this.itemForm.value);
      this.itemForm.reset();
      this.itemForm.get("itemName")?.setValue("");
      this.service.saveQuotes(this.clientCode, this.quoteList);
    }
  }

  initForm() {
    this.itemForm = this.fb.group({
      itemName: ["", Validators.required],
      quantity: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadItems("");
    this.initForm();
    this.itemForm.get("itemName")?.valueChanges.pipe(
      debounceTime(300)
    )
      .subscribe({
        next: (response: any) => {
          this.loadItems(response);
        }
      });
  }

  loadDraftQuotes() {
    this.quoteList = this.service.getQuotes(this.clientCode) || [];
  }

  loadItems(searchText = "") {
    this.service.getAllItems(0, searchText).subscribe({
      next: (response: any) => {
        this.itemList = response;
      }
    });
  }

  generateQuote() {
    this.disableGenerate = true;
    this.service.generateQuote({
      id: this.quoteCode,
      clientCode: this.clientCode,
      items: this.quoteList
    }).subscribe({
      next: (response: any) => {
        this.disableGenerate = false;
        this.quoteList = [];
        this.service.removeQuotes(this.clientCode);
        if (response.filePath) {
          window.open(environment.baseUrl + response.filePath);
        }
      }, error: () => {
        this.disableGenerate = false;
      }
    });

  }
  deleteItem(index: number) {
    this.quoteList.splice(index, 1);
    this.service.saveQuotes(this.clientCode, this.quoteList);
  }
}
